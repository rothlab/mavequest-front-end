<template>
  <div class="summary">
    <!-- Header -->
    <Header :title="title"></Header>

    <!-- Main -->
    <section class="section fill-screen-withheader">
      <div class="container">
        <div class="columns">
          <!-- Filter -->
          <div class="column is-narrow" v-if="!listAllGenes">
            <SearchFilter
              v-bind:hasAssay="this.filter.hasAssay"
              v-bind:hasDiseasePhenotype="this.filter.hasDiseasePhenotype"
              @updatedSearchFilter="setSearchFilter"
            ></SearchFilter>
          </div>

          <!-- Table -->
          <div class="column">
            <ErrorView v-if="showErrorComponent" :response="errorResponse"></ErrorView>

            <b-table
              :data="geneInfo"
              :columns="columns"
              :loading="isLoading"
              :striped="true"
              :hoverable="true"
              :backend-pagination="listAllGenes"
              :paginated="true"
              :pagination-simple="true"
              :total="totalGenes"
              :per-page="pagination.limit"
              v-if="!showErrorComponent"
              @page-change="onPageChange"
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
                    class="assay-phenotype is-capitalized"
                    v-for="assay in props.row.potential_assay"
                    :key="assay.id"
                  >
                    <a v-bind:href="'gene/' + props.row.gene_name + '#' + assay" target="_blank">
                      {{ formatTag(assay) }}
                    </a>
                  </b-tag>
                </b-table-column>
                <b-table-column field="disease_phenotype" label="Disease Phenotype">
                  <b-tag
                    class="assay-phenotype is-capitalized"
                    v-for="phenotype in props.row.disease_phenotype"
                    :key="phenotype.id"
                  >
                    <a v-bind:href="'gene/' + props.row.gene_name + '#' + phenotype" target="_blank">
                      {{ formatTag(phenotype) }}
                    </a>
                  </b-tag>
                </b-table-column>
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
import ErrorView from "@/components/ErrorView.vue";

export default {
  name: "gene-summary",
  components: {
    Header,
    SearchFilter,
    ErrorView
  },
  created() {
    this.setGenesFromQuery(this.$route.query);
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit('updateNav', 'search');

    if (this.listAllGenes) {
      // List all genes from the API
      this.listGenes();
    } else {
      // Query gene info from the API
      this.setGeneInfo();
    }
  },
  beforeRouteUpdate(to, from, next) {
    // Set gene names and query again when the page is about to be updated (when user tries to search again in the summary page)
    this.setGenesFromQuery(to.query);
    this.setGeneInfo();

    // Reset display parameters
    this.showErrorComponent = false;
    this.errorResponse = undefined;

    next();
  },
  data() {
    return {
      errorResponse: undefined,
      showErrorComponent: false,
      listAllGenes: false,
      title: "",
      showLeftPanel: true,
      totalGenes: 0,
      pagination: {
        offset: 0,
        limit: 20
      },
      geneInfo: [],
      columns: [
        { label: "Gene Name" },
        { label: "Entrez ID" },
        { label: "Potential Assay" },
        { label: "Disease Phenotype" }
      ],
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
    setGeneInfo() {
      this.title = "Search Results";

      // Set the table to loading status
      this.isLoading = true;

      // Get gene info
      this.$http
        .get(this.$apiEntryPoint + "/gene/" + this.genes)
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
              this.geneInfo.forEach(element => {
                if (!element.potential_assay || 
                  element.potential_assay.length < 1) {
                  this.geneWOAssay.push(element.gene_name);
                }

                if (!element.disease_phenotype || 
                  element.disease_phenotype.length < 1) {
                  this.geneWOPhenotype.push(element.gene_name);
                }
              });

              this.setSearchFilter();
            }

            // Give a warning if some genes are missing
            if (json.hasOwnProperty("missing") && json.missing.length > 0) {
              this.$snackbar.open({
                message: `Some gene names had no matches: ${json.missing.join(
                  ", "
                )}`,
                type: "is-warning",
                position: "is-top",
                actionText: "Dismiss"
              });
            }

            // If nothing found, show an error panel
            if (this.completeGeneInfo.length < 1) {
              this.errorResponse = { status: 404 };
              this.showErrorComponent = true;
            }
          },
          response => {
            // Error handling
            this.showErrorComponent = true;
            this.errorResponse = response;
          }
        )
        .then(() => {
          // Set the table to complete status
          this.isLoading = false;
        });
    },
    listGenes() {
      // Set the table to loading status
      this.isLoading = true;

      // Check for a valid filter
      if (!(this.filter.hasAssay || this.filter.hasDiseasePhenotype)) {
        this.title = "Gene Summary"
        this.showErrorComponent = true;
        this.errorResponse = "No filters were specified.";
        return;
      }

      // Set filter status
      const filter = this.filter.hasAssay
        ? "has_assay"
        : "has_disease_phenotype";

      // Set page title
      this.title = (filter == "has_assay" ? "Potential Assay" : "Phenotype");

      // Set pagination parameters
      const offset = this.pagination.offset;
      const limit = this.pagination.limit;

      // Get gene info
      this.$http
        .get(
          `${
            this.$apiEntryPoint
          }/genes/?filter=${filter}&offset=${offset}&limit=${limit}`
        )
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
            if (json.hasOwnProperty("genes")) {
              this.totalGenes = json.total;
              this.pagination = json.pagination;
              this.geneInfo = json.genes;
            }
          },
          response => {
            // Error handling
            this.showErrorComponent = true;
            this.errorResponse = { response: response };
          }
        )
        .then(() => {
          // Set the table to complete status
          this.isLoading = false;
        });
    },
    onPageChange(page) {
      // Update pagination parameters and list
      if (this.listAllGenes) {
        this.pagination.offset = (page - 1) * this.pagination.limit;
        this.listGenes();
      }
    },
    setSearchFilter(update = undefined) {
      // Capture changes on search filters
      if (update) {
        this.filter.hasAssay = update.hasAssay;
        this.filter.hasDiseasePhenotype = update.hasDiseasePhenotype;
      }

      // Call the API directly if we are listing all genes
      if (this.listAllGenes) {
        this.listGenes();
      } else {
        if (!this.filter.hasAssay && !this.filter.hasDiseasePhenotype) {
          this.geneInfo = this.completeGeneInfo;
          return;
        }

        // Update the table data based on search filter changes
        this.geneInfo = this.geneInfo.filter(element => {
          if (
            this.filter.hasAssay &&
            this.geneWOAssay.includes(element.gene_name)
          ) {
            return false;
          }

          if (
            this.filter.hasDiseasePhenotype &&
            this.geneWOPhenotype.includes(element.gene_name)
          ) {
            return false;
          }

          return true;
        });
      }
    },
    setGenesFromQuery(query) {
      // Set the mode of the page based on the existance of gene param.
      // If it's not existed, then a list of all genes that passed a certain filter will be displayed.
      // Otherwise, only list the genes requested.
      if (query.hasOwnProperty("gene")) {
        // Get the genes from the router
        this.listAllGenes = false;
        this.genes = query.gene.toUpperCase();
        this.genes = this.genes
          .split(",")
          .filter(Boolean)
          .map(res => res.trim());

        // If no gene was in there, pass an empty array
        if (this.genes == "") this.genes = [];
      } else {
        this.listAllGenes = true;
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
    },
    formatTag(tag) {
      switch (tag) {
        case "genome_rnai":
          return "RNAi"
        case "genome_crispr":
          return "CRISPR KO"
        case "huri":
          return "Interactome"
        case "overexpression":
          return "Over Expression"
        case "omim":
          return "OMIM"
        case "cancer_census":
          return "Cancer Census"
        default:
          return tag;
      }
    }
  }
};
</script>

<style scoped>
.assay-phenotype {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
