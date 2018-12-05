<template>
  <div class="summary">
    <!-- Header -->
    <Header title="Search Results" :genes="genes"></Header>

    <!-- Main -->
    <section class="section">
      <div class="container">
        <div class="columns">
          <!-- Filter -->
          <div class="column is-narrow">
            <SearchFilter v-bind:hasAssay="this.filter.hasAssay" v-bind:hasDiseasePhenotype="this.filter.hasDiseasePhenotype"></SearchFilter>
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
                <b-table-column field="gene_name" label="Gene Name" width="0.1">
                  <a v-bind:href="'gene/' + props.row.gene_name" target="_blank">{{props.row.gene_name}}</a>
                </b-table-column>
                <b-table-column field="entrez_id" label="Entrez ID" width="0.1">
                  <a
                    v-bind:href="'https://www.ncbi.nlm.nih.gov/gene/' + props.row.entrez_id"
                    target="_blank"
                  >
                    {{props.row.entrez_id}}
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </b-table-column>
                <b-table-column field="potential_assay" label="Potential Assay" width="0.4">
                  <b-tag
                    class="assay-phenotype"
                    v-for="assay in props.row.potential_assay"
                    :key="assay.id"
                  >{{ assay }}</b-tag>
                </b-table-column>
                <b-table-column field="disease_phenotype" label="Dispease Phenotype" width="0.4">
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
                    <p><b-icon icon="meh" size="is-large"></b-icon></p>
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
    const query = this.$route.query;

    // Get the genes from the router
    this.genes = query.gene;
    this.genes = this.genes.split(",");

    // If no gene was in there, pass an empty array
    if (this.genes == "") {
      this.genes = [];
    }

    // Get advanced search status from the routher
    this.filter.hasAssay = typeof query.hasAssay == "string" ? query.hasAssay.toLowerCase() == 'true' : query.hasAssay;
    this.filter.hasDiseasePhenotype = typeof query.hasDiseasePhenotype == "string" ? query.hasDiseasePhenotype.toLowerCase() == 'true' : query.hasDiseasePhenotype;
  },
  mounted() {
    this.getGeneInfo();
  },
  data() {
    return {
      geneInfo: [],
      isLoading: false,
      filter: {
        hasAssay: false,
        hasDiseasePhenotype: false
      }
    };
  },
  methods: {
    getGeneInfo() {
      // Set the table to loading status
      this.isLoading = true

      // Get gene info
      this.$http.get('https://demo6436483.mockable.io/gene/' + this.genes)
      .then(response => {
        // Make sure the response has a non-empty body
        if (!response.hasOwnProperty('body') || typeof response.body == "string" ) {
          return;
        }

        const json = response.body

        // Make sure the response contains gene info
        // TODO: validate response fingerprint
        if (json.hasOwnProperty('found')) {
          this.geneInfo = json.found;
        }

        // Give a warning if some genes are missing
        if (json.hasOwnProperty('missing') && json.missing.length > 0) {
          this.$snackbar.open({
            message: `Some gene names had no matches: ${json.missing.join(", ")}`,
            type: "is-warning",
            position: "is-top",
            actionText: "Dismiss",
            indefinite: true
          });
        }
      }, response => {
        // Error callback
        const error = response.status;
        let errorMsg = "Other Errors";

        // Handle common error
        switch (error) {
          case 404:
            errorMsg = "No record was found."
            break;
          default:
            break;
        }
        this.$snackbar.open({
          message: `Failed. Error Message: [${response.status}] ${errorMsg}`,
          type: "is-danger",
          position: "is-top",
          actionText: "Dismiss",
          indefinite: true
        });
      })
      .then(() => {
        // Set the table to complete status
        this.isLoading = false;
      });
    }
  }
};
</script>

<style scoped>
.assay-phenotype {
  margin-right: 5px;
}
</style>
