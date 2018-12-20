<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar is-info is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">{{ appName }}</a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start"></div>
        <div class="navbar-end">
          <router-link to="/" class="navbar-item is-active">Search</router-link>
          <router-link to="/about" class="navbar-item">About</router-link>
        </div>
      </div>
    </nav>

    <!-- Inject router view -->
    <router-view/>

    <!-- Footer -->
    <footer class="footer footer-padding">
      <div class="content has-text-centered">
        <p>
          <strong>{{ appName }}</strong>
          by {{ author }} from {{ organization }} with
          <b-icon icon="heart" size="is-small" type="is-dark"></b-icon>
        </p>
        <p>Version {{version}}. ©2018 Roth Lab.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appName: "MaveQuest",
      author: "Kevin Kuang & Jarry Barber",
      organization: "Roth Lab",
      version: process.env.GIT_VERSION
    };
  }
};
</script>

<style>
.has-text-link {
  color: #3273dc !important;
}
.is-vcentered {
  align-items: center;
}
.in-paragraph {
  margin-bottom: 1.5rem;
}
.in-list {
  margin-top: 1rem;
}
.footer-padding {
  padding: 3rem 1.5rem 3rem !important;
}
</style>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Navbar related styles
$navbar-breakpoint: 0px;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
