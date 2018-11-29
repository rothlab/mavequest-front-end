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
              <SearchBar></SearchBar>
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
              :paginated="true"
              :pagination-simple="true"
              :per-page="20"
              :columns="columns"
            ></b-table>
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
  name: "summary",
  components: {
    SearchBar,
    SearchFilter
  },
  data() {
    return {
      data: [
        {
          gene_name: "UBE2I",
          entrez_id: "7329",
          potential_assay: "Y2H, Y-Comp, RNAi, CRISPR",
          disease_phenotype: "OMIM, HGMD"
        },
        {
          gene_name: "CBS",
          entrez_id: "875",
          potential_assay: "Y2H, Y-Comp",
          disease_phenotype: "OMIM, HGMD"
        },
        {
          gene_name: "LDLRAP1",
          entrez_id: "26119",
          potential_assay: "Y2H, RNAi, CRISPR",
          disease_phenotype: "OMIM, HGMD"
        }
      ],
      columns: [
        {
          field: "gene_name",
          label: "Name"
        },
        {
          field: "entrez_id",
          label: "Entrez ID",
          numeric: true
        },
        {
          field: "potential_assay",
          label: "Potential Assay"
        },
        {
          field: "disease_phenotype",
          label: "Disease Phenotype"
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
</style>
