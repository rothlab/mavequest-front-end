<template>
  <div class="summary">
    <!-- Header -->
    <Header :title="title"></Header>

    <!-- Main -->
    <section class="section fill-screen-withheader">
      <div class="container">
        <div class="columns">

          <!-- Table -->
          <div class="column">
            <ErrorView v-if="showErrorComponent" :response="errorResponse"></ErrorView>

            <b-table
              :data="filteredGeneInfo"
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
              <!-- Customize table headers  -->
              <template slot-scope="props" slot="header">
                <div v-if="props.column.meta">
                  <span>{{ props.column.label }}&nbsp;</span>
                  <FilterView :filters="props.column.meta" 
                    :formatter="filterParams.formatTag"
                    @updateFilter="updateRes" :prevSelected="filterList"></FilterView>
                </div>

                <div v-else>{{ props.column.label }}</div>
              </template>

              <!-- Customize table bottom left -->
              <template slot="bottom-left">
                <div class="is-flex" v-if="filterList.length > 0">
                  <b-taglist attached class="is-marginless">
                    <b-tag class="is-marginless" type="is-dark" size="is-medium">
                      <b-icon pack="fas" icon="filter" size="is-small" 
                        style="margin-left: 0px; margin-right: 0px;"></b-icon>
                    </b-tag>
                    <b-tag class="is-marginless" type="is-link" size="is-medium">Filter(s) applied</b-tag>
                  </b-taglist>

                  <span>&nbsp;&nbsp;</span>

                  <b-tag class="is-marginless" type="is-light" size="is-medium"
                    @click.native="filterList = []" style="cursor: pointer;">
                      <b-icon pack="fas" icon="trash-alt" size="is-small" 
                        style="margin-left: 0px; margin-right: 0px;"></b-icon>
                  </b-tag>
                </div>
              </template>

              <!-- Customize table columns -->
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
                <b-table-column field="potential_assay" label="Potential Assay"
                  :meta="filterParams.availAssays">
                  <b-tag
                    class="assay-phenotype is-capitalized"
                    v-for="assay in props.row.potential_assay"
                    :key="assay.id"
                  >
                    <a v-bind:href="'gene/' + props.row.gene_name + '#' + assay" target="_blank">
                      {{ filterParams.formatTag(assay) }}
                    </a>
                  </b-tag>
                </b-table-column>
                <b-table-column field="disease_phenotype" label="Disease Phenotype"
                  :meta="filterParams.availPhenotypes">
                  <b-tag
                    class="assay-phenotype is-capitalized"
                    v-for="phenotype in props.row.disease_phenotype"
                    :key="phenotype.id"
                  >
                    <a v-bind:href="'gene/' + props.row.gene_name + '#' + phenotype" target="_blank">
                      {{ filterParams.formatTag(phenotype) }}
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
import ErrorView from "@/components/ErrorView.vue";
import FilterView from "@/components/FilterView.vue";
import FilterParams from "@/assets/filterParams.js";

export default {
  name: "gene-summary",
  components: {
    Header,
    ErrorView,
    FilterView
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
  computed: {
    filteredGeneInfo: function () {
      return this.geneInfo.filter(e => 
        this.filterList.length < 1 || 
        this.filterList.every(r => e.disease_phenotype.includes(r) || 
          e.potential_assay.includes(r))
      );
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
      isLoading: false,
      filterList: [],
      filterParams: FilterParams
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
              this.geneInfo = json.found;
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
      this.title = "Database Summary"

      // If invalid show param, just return everything
      let show = this.$route.query.show;
      const validParams = ["all", "assays", "phenotypes"];
      if (!(show && validParams.includes(show))) {
        show = "all";
      }

      // Set request config
      const config = {
        params: {
          filter: show,
          offset: this.pagination.offset,
          limit: this.pagination.limit
        }
      };

      // Get gene info
      this.$http
        .get(`${this.$apiEntryPoint}/genes/`, config)
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
    updateRes(val, total) {
      // Update the filter list accordingly
      const left = this.filterList.filter(e => !total.includes(e));
      this.filterList = val.concat(left);
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
      if (query.filters) {
        const filters = query.filters.split(",");
        this.filterList = filters.filter(e => this.filterParams.availAssays.includes(e) || 
          this.filterParams.availPhenotypes.includes(e))
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
