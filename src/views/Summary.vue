<template>
  <div class="summary">
    <!-- Header -->
    <Header title="Search Results" :genes="genes"></Header>

    <!-- Main -->
    <section class="section fill-screen-withheader">
      <div class="container">
        <div class="columns">
          <!-- Filter -->
          <div class="column is-narrow">
            <SearchFilter
              v-bind:hasAssay="this.filter.hasAssay"
              v-bind:hasDiseasePhenotype="this.filter.hasDiseasePhenotype"
              @updatedSearchFilter="setSearchFilter"
            ></SearchFilter>
          </div>

          <!-- Table -->
          <div class="column">
            <b-table
              :data="geneInfo"
              :loading="isLoading"
              :striped="true"
              :hoverable="true"
              :paginated="true"
              :pagination-simple="true"
              :per-page="20"
            >
              <!-- Customized table columns -->
              <template slot-scope="props">
                <b-table-column field="gene_name" label="Gene Name">
                  <a
                    v-bind:href="'gene/' + props.row.gene_name"
                    target="_blank"
                  >{{props.row.gene_name}}</a>
                </b-table-column>
                <b-table-column field="entrez_id" label="Entrez ID">
                  <a
                    v-bind:href="'https://www.ncbi.nlm.nih.gov/gene/' + props.row.entrez_id"
                    target="_blank"
                  >
                    {{props.row.entrez_id}}
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </b-table-column>
                <b-table-column field="potential_assay" label="Potential Assay">
                  <b-tag
                    class="assay-phenotype"
                    v-for="assay in props.row.potential_assay"
                    :key="assay.id"
                  >{{ assay }}</b-tag>
                </b-table-column>
                <b-table-column field="disease_phenotype" label="Dispease Phenotype">
                  <b-tag
                    class="assay-phenotype"
                    v-for="phenotype in props.row.disease_phenotype"
                    :key="phenotype.id"
                  >{{ phenotype }}</b-tag>
                </b-table-column>
              </template>

              <!-- Table empty state -->
              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="meh" size="is-large"></b-icon>
                    </p>
                    <p>Nothing found.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import SearchFilter from "@/components/SearchFilter.vue";

export default {
  name: "gene-summary",
  components: {
    Header,
    SearchFilter
  },
  created() {
    this.setGenesFromQuery(this.$route.query);
  },
  mounted() {
    // Query gene info from the API
    this.setGeneInfo();
  },
  beforeRouteUpdate(to, from, next) {
    // Set gene names and query again when the page is about to be updated (when user tries to search again in the summary page)
    this.setGenesFromQuery(to.query);
    this.setGeneInfo();
    next();
  },
  data() {
    return {
      geneInfo: [],
      completeGeneInfo: [],
      isLoading: false,
      filter: {
        hasAssay: false,
        hasDiseasePhenotype: false
      },
      geneWOAssay: [],
      geneWOPhenotype: []
    };
  },
  methods: {
    setGeneInfo () {
      // Set the table to loading status
      this.isLoading = true;

      // Get gene info
      this.$http
        .get("https://api-dot-glass-ally-143617.appspot.com/gene/" + this.genes)
        .then(
          response => {
            // Make sure the response has a non-empty body
            if (
              !response.hasOwnProperty("body") ||
              typeof response.body == "string"
            ) {
              return;
            }

            const json = response.body;

            // Make sure the response contains gene info
            // TODO: validate response fingerprint
            if (json.hasOwnProperty("found")) {
              this.completeGeneInfo = json.found;
              this.geneInfo = this.completeGeneInfo;

              // Find genes that don't have potential assay or disease phenotype
              this.geneInfo.forEach((element) => {
                if (element.potential_assay.length < 1) {
                  this.geneWOAssay.push(element.gene_name);
                }

                if (element.disease_phenotype.length < 1) {
                  this.geneWOPhenotype.push(element.gene_name);
                }
              });
            }

            // Give a warning if some genes are missing
            if (json.hasOwnProperty("missing") && json.missing.length > 0) {
              this.$snackbar.open({
                message: `Some gene names had no matches: ${json.missing.join(
                  ", "
                )}`,
                type: "is-warning",
                position: "is-top",
                actionText: "Dismiss",
              });
            }
          },
          response => {
            // Error callback
            const error = response.status;
            let errorMsg = "Other Errors";

            // Handle common error
            switch (error) {
              case 404:
                errorMsg = "No record was found.";
                break;
              default:
                break;
            }
            this.$snackbar.open({
              message: `Failed. Error Message: [${
                response.status
              }] ${errorMsg}`,
              type: "is-danger",
              position: "is-top",
              actionText: "Dismiss",
            });
          }
        )
        .then(() => {
          // Set the table to complete status
          this.isLoading = false;
        });
    },
    setSearchFilter (update) {
      // Capture changes on search filters
      this.filter.hasAssay = update.hasAssay;
      this.filter.hasDiseasePhenotype = update.hasDiseasePhenotype;

      if (!this.filter.hasAssay && !this.filter.hasDiseasePhenotype) {
        this.geneInfo = this.completeGeneInfo;
        return;
      }

      // Update the table data based on search filter changes
      this.geneInfo = this.geneInfo.filter(element => {
        if (this.filter.hasAssay && this.geneWOAssay.includes(element.gene_name)) {
          return false;
        }

        if (this.filter.hasDiseasePhenotype && this.geneWOPhenotype.includes(element.gene_name)) {
          return false;
        }

        return true;
      });
    },
    setGenesFromQuery (query) {
      // Get the genes from the router
      this.genes = query.gene.toUpperCase();
      this.genes = this.genes.split(",");

      // If no gene was in there, pass an empty array
      if (this.genes == "") {
        this.genes = [];
      }

      // Get advanced search status from the routher
      this.filter.hasAssay =
        typeof query.hasAssay == "string"
          ? query.hasAssay.toLowerCase() == "true"
          : query.hasAssay;
      this.filter.hasDiseasePhenotype =
        typeof query.hasDiseasePhenotype == "string"
          ? query.hasDiseasePhenotype.toLowerCase() == "true"
          : query.hasDiseasePhenotype;
    }
  }
};
</script>

<style scoped>
.assay-phenotype {
  margin-right: 5px;
}
</style>
