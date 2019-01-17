<template>
  <section class="hero is-info fill-screen">
    <div class="hero-body">
      <div class="container search-display">
        <h1 class="title">Search MaveQuest</h1>
        <h2 class="subtitle">Search with Gene Symbol</h2>
        <div class="container is-marginless is-fullwidth">
          <SearchBar showButton v-bind:hasAssay="filter.hasAssay" v-bind:hasDiseasePhenotype="filter.hasDiseasePhenotype"></SearchBar>
          <section class="section no-leftright-padding">
          <div class="columns">
            <div class="column is-half">
              <SearchFilter @updatedSearchFilter="setSearchFilter" class="is-fullheight"></SearchFilter>
            </div>
            <div class="column is-half">
              <div class="card below-search">
                <header class="card-header">
                  <p class="card-header-title">Database Summary</p>
                </header>
                <div class="card-content">
                  <div class="content has-text-left is-medium">
                    <a class="has-text-link" href="summary?hasAssay=true">Genes with potential assays</a>
                    <br>
                    <a class="has-text-link" href="summary?hasDiseasePhenotype=true">Genes with phenotypes</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </section>
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
.fill-screen {
  min-height: calc(100vh - 3.25rem - 7.5rem);
}
.fill-screen > .hero-body {
  display: flex;
  align-items: center;
}
.no-leftright-padding {
  padding-left: 0% !important;
  padding-right: 0% !important;
}
.no-topbottom-padding {
  padding-top: 0% !important;
  padding-bottom: 0% !important;
}
.is-fullwidth {
  max-width: 100% !important;
  width: 100% !important;
}
.search-display {
  min-width: 80vw;
}
.fill-screen-withheader {
  min-height: calc(100vh - 3.25rem - 19rem);
}
</style>
