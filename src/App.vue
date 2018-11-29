<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->

   <nav class="navbar has-shadow">
        <div class="container">
          <div class="navbar-brand"><a class="navbar-item" href="../">
          <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox"/></a>
        </div>
      </div>
    </nav>

    <section class="hero is-medium is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Search Database</h1>
          <SearchBar></SearchBar>
        </div>
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
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
