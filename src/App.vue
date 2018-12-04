<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">Assay & Phenotype Database</a>
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
  </div>
</template>

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