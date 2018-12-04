<template>
  <section class="hero is-info">
    <div class="hero-body">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <h1 class="title" v-if="title">{{title}}</h1>
            <h2 class="subtitle" v-if="subtitle">{{subtitle}}</h2>
          </div>
          <div class="level-right">
            <SearchBar showButton></SearchBar>
          </div>
        </div>
      </div>
    </div>
  </section>
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
      subtitle: String
    }
}
</script>

<style scoped>
.level-right {
  width: 50%;
}
.search-bar {
  width: 100%;
}
</style>