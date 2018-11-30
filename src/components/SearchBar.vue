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
      <div class="column is-narrow" v-if="showButton">
        <button class="button is-medium" @click="searchGenes">
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
      // TODO: Give an error message if no gene was inputed

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