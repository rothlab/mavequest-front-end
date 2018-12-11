<template>
  <div class="search-bar">
    <div class="columns">
      <div class="column">
        <b-taginput
          v-model="genes"
          size="is-medium"
          class="is-uppercase"
        ></b-taginput>
      </div>
      <div class="column is-narrow no-topbottom-padding" v-if="showButton">
        <button class="button is-medium is-fullwidth" @click="searchGenes">
          <b-icon icon="search"></b-icon>
          <span>Search</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    showButton: Boolean,
    genes: {
      default: () => [],
      type: Array
    },
    hasAssay: {
      default: false,
      type: Boolean
    },
    hasDiseasePhenotype: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    searchGenes() {
      // Give a warning if no gene was inputed
      if (this.genes.length == 0) {
        this.$snackbar.open({
          message: "Please enter at least one gene to search.",
          type: "is-warning",
          position: "is-top",
          actionText: "Retry",
          indefinite: true
        });
        return;
      }

      // Call router
      const dest = {
        path: "/summary",
        query: {
          gene: this.genes.join(","),
          hasAssay: this.hasAssay,
          hasDiseasePhenotype: this.hasDiseasePhenotype
        }
      };
      this.$router.push(dest);
    }
  }
};
</script>

<style scoped>
.no-topbottom-padding {
  display: flex;
  align-items: center;
  padding-top: 0%;
  padding-bottom: 0%;
}
</style>
