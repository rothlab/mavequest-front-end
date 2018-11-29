<template>
<div class="search-bar">
  <div class="columns">
    <div class="column">
      <b-taginput size="is-medium"></b-taginput>
    </div>
    <div class="column is-narrow is-hidden-mobile" v-if="showButton">
      <a class="button is-medium" href="summary">
        <b-icon icon="search"></b-icon>
        <span>Search</span>
      </a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
      showButton: Boolean
  }
};
</script>