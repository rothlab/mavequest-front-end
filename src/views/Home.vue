<template>
  <section class="hero is-info is-primary fill-screen is-bold">
    <div class="hero-body">
      <div class="container search-display">
        <h1 class="title">MaveQuest</h1>
        <h2 class="subtitle">Explore potential assays and phenotypes for human gene variants</h2>
        <div class="container is-marginless is-fullwidth">
          <div class="columns">
            <div class="column">
              <SearchBar showButton :filters="filters"></SearchBar>
            </div>
            <div class="column is-narrow">
              <b-dropdown hoverable class="is-fullwidth" @change="jumpToSummaryWithParam">
                <button slot="trigger" 
                  class="button is-medium is-white has-text-info 
                    is-fullwidth is-fullheight">
                  <span>Summary</span>
                  <b-icon pack="fas" icon="sort-down"></b-icon>
                </button>

                <b-dropdown-item value="all">All Genes</b-dropdown-item>
                <b-dropdown-item value="assays">Genes with Potential Assays</b-dropdown-item>
                <b-dropdown-item value="phenotypes">Genes with Disease Phenotypes</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <section class="section no-leftright-padding">
          <div class="columns">
            <div class="column is-half">
              <SearchFilter @updatedSearchFilter="setSearchFilter" class="is-fullheight"></SearchFilter>
            </div>
            <div class="column is-half">
              <div class="card below-search">
                <header class="card-header">
                  <p class="card-header-title">Updates and News</p>
                </header>
                <div class="card-content">
                  <div class="content has-text-left is-medium">
                    <span>No updates available</span>
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
      filters: [],
      summaryParams: ""
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
    },
    jumpToSummaryWithParam (param) {
      // Call router
      const dest = {
        path: "/summary",
        query: { show: param }
      };
      this.$router.push(dest);
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
.is-fullwidth > .dropdown-trigger {
  max-width: 100% !important;
  width: 100% !important;
}
</style>
