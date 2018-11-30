<template>
  <section class="hero is-info is-bold is-fullheight">
    <div class="hero-body">
      <div class="container has-text-left">
        <h1 class="title">Search Database</h1>
        <h2 class="subtitle">Search with Gene Symbol, Entrez ID or Ensembl ID</h2>
        <div class="container">
          <SearchBar showButton v-bind:hasAssay="filter.hasAssay" v-bind:hasDiseasePhenotype="filter.hasDiseasePhenotype"></SearchBar>
          <div class="columns">
            <div class="column is-half">
              <SearchFilter @updatedSearchFilter="setSearchFilter"></SearchFilter>
            </div>
            <div class="column is-half">
              <div class="card below-search">
                <header class="card-header">
                  <p class="card-header-title">Database Summary</p>
                </header>
                <div class="card-content">
                  <div class="content has-text-left is-medium">
                    <a class="has-text-link">List all genes with potential assays</a>
                    <br>
                    <a class="has-text-link">List all genes with disease phenotypes</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";
import SearchFilter from "@/components/SearchFilter.vue"

export default {
  name: "home",
  components: {
    SearchBar,
    SearchFilter
  },
  data () {
    return {
      filter: {
        hasAssay: false,
        hasDiseasePhenotype: false
      }
    }
  },
  methods: {
    setSearchFilter (update) {
      // Capture changes on search filters
      this.filter.hasAssay = update.hasAssay;
      this.filter.hasDiseasePhenotype = update.hasDiseasePhenotype;
    }
  }
};
</script>

<style>
.card.below-search {
  height: 100%;
}
</style>
