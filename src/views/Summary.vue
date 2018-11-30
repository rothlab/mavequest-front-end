<template>
  <div class="summary">
    <!-- Header -->
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <h1 class="title">Search Results</h1>
            </div>
            <div class="level-right">
              <SearchBar v-bind:genes="genes"></SearchBar>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main -->
    <section class="section">
      <div class="container">
        <div class="columns">
          <!-- Filter -->
          <div class="column is-narrow">
            <SearchFilter></SearchFilter>
          </div>

          <!-- Table -->
          <div class="column">
            <b-table
              :data="data"
              :striped="true"
              :hoverable="true"
              :paginated="true"
              :pagination-simple="true"
              :per-page="20"
            >
              <template slot-scope="props">
                <b-table-column field="gene_name" label="Gene Name" width="0.1">
                  <a v-bind:href="'gene/' + props.row.gene_name">{{props.row.gene_name}}</a>
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
                  <b-tag class="assay-phenotype" v-for="assay in props.row.potential_assay" :key="assay.id">{{ assay }}</b-tag>
                </b-table-column>
                <b-table-column field="disease_phenotype" label="Dispease Phenotype" width="0.4">
                  <b-tag class="assay-phenotype" v-for="phenotype in props.row.disease_phenotype" :key="phenotype.id">{{ phenotype }}</b-tag>
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
import SearchBar from "@/components/SearchBar.vue";
import SearchFilter from "@/components/SearchFilter.vue";

export default {
  name: "gene-summary",
  components: {
    SearchBar,
    SearchFilter
  },
  created() {
    this.genes = this.$route.query.gene;
    this.genes = this.genes.toUpperCase().split(',');
  },
  data() {
    return {
      data: [
        {
          gene_name: "UBE2I",
          entrez_id: "7329",
          potential_assay: ["Y2H", "Y-Comp", "RNAi", "CRISPR"],
          disease_phenotype: ["OMIM", "HGMD"]
        },
        {
          gene_name: "CBS",
          entrez_id: "875",
          potential_assay: ["Y2H", "Y-Comp"],
          disease_phenotype: ["OMIM", "HGMD"]
        },
        {
          gene_name: "LDLRAP1",
          entrez_id: "26119",
          potential_assay: ["Y2H", "RNAi", "CRISPR"],
          disease_phenotype: ["OMIM", "HGMD"]
        }
      ]
    };
  }
};
</script>

<style scoped>
.level-right {
  width: 40%;
}
.search-bar {
  width: 100%;
}
.assay-phenotype {
  margin-right: 5px;
}
</style>
