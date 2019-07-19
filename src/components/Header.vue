<template>
  <div>
    <section class="hero is-info is-hidden-mobile is-bold">
      <div class="hero-body header-control">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <h1 class="title" v-if="title">{{title}}</h1>
              <h2 class="subtitle" v-if="subtitle">{{subtitle}}</h2>
            </div>

            <div class="level-right search box">
              <SearchBar showButton :genes="genes"></SearchBar>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Add a back-to-top float button -->
    <back-to-top visibleoffset="400">
      <figure class="image is-48x48">
        <img src="../assets/back-to-top.png" alt="">
      </figure>
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
  },
  methods: {
    updatePageTitle() {
      document.title = `${this.title} | ${process.env.VUE_APP_NAME} - ${process.env.VUE_APP_SUBTITLE}`;
    }
  },
  mounted() {
    // Update page title
    this.updatePageTitle();
  },
  beforeUpdate() {
    // Update page title
    this.updatePageTitle();
  }
};
</script>

<style scoped>
.header-control {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.search {
  width: 60%
}
.icon-set {
  position: relative;
}
.btt-icon-bg {
  color: white;
  font-size: 0.9rem;
}
</style>
