<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">{{ appName }}</a>
        <span class="navbar-burger burger" data-target="navbarMenuHero">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div id="navbarMenuHero" class="navbar-menu">
        <div class="navbar-end">
          <router-link to="/" class="navbar-item is-active">Search</router-link>
          <router-link to="/about" class="navbar-item">About</router-link>
        </div>
      </div>
    </nav>

    <!-- Inject router view -->
    <router-view/>

    <!-- Footer -->
    <footer class="footer">
        <div class="content has-text-centered">
            <p>
              <strong>{{ appName }}</strong> by {{ author }} from {{ organization }} with <b-icon icon="heart" size="is-small" type="is-danger"></b-icon>
            </p>
            <p>
              Version {{ version }}
            </p>
        </div>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      appName: "Assay & Phenotype Database",
      author: "Kevin Kuang",
      organization: "Roth Lab",
      version: "pre-release v.1"
    }
  }
}
</script>

<style>
.navbar-burger {
  color: white;
}
.has-text-link {
  color: #3273dc !important;
}
.is-vcentered {
  align-items: center
}
.in-paragraph {
  margin-bottom:1.5rem
}
</style>