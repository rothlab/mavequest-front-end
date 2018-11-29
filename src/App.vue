<template>
  <div id="app">
    <section class="hero is-info is-bold is-fullheight">
      <div class="hero-head">
        <!-- Add navigation bar -->
        <div class="container">
          <header class="navbar">
            <div class="navbar-brand">
              <a class="navbar-item">Assay & Phenotype Database</a>
              <span class="navbar-burger burger" data-target="navbarMenuHero">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHero" class="navbar-menu">
            <div class="navbar-end">
              <a class="navbar-item is-active">Search</a>
              <a class="navbar-item">Contact</a>
            </div>
            </div>
          </header>
        </div>
      </div>

      <div class="hero-body">
        <div class="container has-text-left">
          <!-- Add search interface -->
          <h1 class="title">Search Database</h1>
          <h2 class="subtitle">Search with Gene Symbol, Entrez ID or Ensembl ID</h2>
          <SearchBar></SearchBar>
        </div>
      </div>

      <div class="hero-foot">
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from "./components/SearchBar";

export default {
  name: "app",
  components: {
    SearchBar
  }
};
</script>

<style>
.navbar-burger {
  color: white
}
</style>
