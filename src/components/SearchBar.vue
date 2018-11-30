<template>
  <div class="search-bar">
    <div class="columns">
      <div class="column">
        <b-taginput v-model="genes" size="is-medium"></b-taginput>
      </div>
      <div class="column is-narrow is-hidden-mobile" v-if="showButton">
        <router-link :to="{ path:'/summary', query: {gene: genes.join(',')}}">
          <button class="button is-medium">
            <b-icon icon="search"></b-icon>
            <span>Search</span>
          </button>
        </router-link>
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
    }
  }
};
</script>