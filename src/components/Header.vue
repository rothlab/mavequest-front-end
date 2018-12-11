<template>
  <div>
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <h1 class="title" v-if="title">{{title}}</h1>
              <h2 class="subtitle" v-if="subtitle">{{subtitle}}</h2>
            </div>
            <div class="level-right is-hidden-mobile">
              <SearchBar showButton :genes="genes"></SearchBar>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Add a back-to-top float button -->
    <back-to-top visibleoffset="400">
      <b-icon icon="fas fa-chevron-circle-up" size="is-large"></b-icon>
    </back-to-top>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "Header",
  components: {
    SearchBar
  },
  props: {
    title: String,
    subtitle: String,
    genes: Array
  }
};
</script>

<style scoped>
.level-right {
  min-width: 50%;
  max-width: 70%;
}
.search-bar {
  width: 100%;
}
</style>