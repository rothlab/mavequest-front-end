<template>
  <section class="hero is-info is-primary fill-screen is-bold">
    <div class="hero-body">
      <div class="container search-display">
        <h1 class="title">MaveQuest</h1>
        <h2 class="subtitle">Explore potential assays and phenotypes for human gene variants</h2>
        <div class="container is-marginless is-fullwidth">
          <SearchBar showButton :filters="filters"></SearchBar>
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
      filters: []
    }
  },
  mounted () {
    // Update page title
    document.title = `${process.env.VUE_APP_NAME} - ${process.env.VUE_APP_SUBTITLE}`;

    // Update highlighted navbar item
    this.$emit('updateNav', 'search');
  },
  methods: {
    setSearchFilter (update) {
      // Capture changes on search filters
      this.filters = update;
    }
  }
};
</script>

<style>
.card.below-search {
  height: 100%;
}
.fill-screen {
  min-height: calc(100vh - 3.25rem - 4.5rem);
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
  min-height: calc(100vh - 3.25rem - 13.5rem);
}
.fill-screen-withoutheader {
  min-height: calc(100vh - 7.75rem);
}
</style>
