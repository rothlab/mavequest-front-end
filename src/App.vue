<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar is-white is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="./assets/logo.png" alt="MaveQuest">
          <span class="is-size-5">&nbsp; {{ appName }}</span>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start"></div>
        <div class="navbar-end">
          <router-link to="/" class="navbar-item" v-bind:class="{ 'is-active': isActive == 'search' }">Search</router-link>
          <router-link to="/about" class="navbar-item" v-bind:class="{ 'is-active': isActive == 'about' }">About</router-link>
          <router-link to="/docs/api" class="navbar-item" v-bind:class="{ 'is-active': isActive == 'api' }">API</router-link>
        </div>
      </div>
    </nav>

    <!-- Inject router view -->
    <router-view v-on:updateNav="updateActiveNavbarItem"/>

    <!-- Footer -->
    <footer class="footer footer-padding">
      <div class="content">
        <div class="level">
          <div class="level-left">
            <p>
              © <b-tooltip :label="'Version ' + version" position="is-top" type="is-dark"><strong>{{ appName }} 
                ({{version.match(/[^-]+/).join()}})</strong></b-tooltip> made at the <a href="http://llama.mshri.on.ca/" target="_blank">{{ organization }}</a> 
              with <b-icon icon="heart" size="is-small" type="is-danger"></b-icon>
            </p>
          </div>
          <div class="level-right">
            <div class="level-item">
              <a href="/docs/tos" target="_blank">Terms</a>
            </div>
            <div class="level-item">
              <a href="/docs/privacy" target="_blank">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appName: process.env.VUE_APP_NAME,
      author: process.env.VUE_APP_AUTHORS,
      organization: process.env.VUE_APP_ORGANIZATION,
      version: process.env.GIT_VERSION,
      isActive: 'search'
    };
  },
  methods: {
    updateActiveNavbarItem(value) {
      this.isActive = value;
    }
  }
};
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Navbar related styles
$navbar-breakpoint: 0px;
$table-row-active-background-color: $cyan;
$menu-item-active-color: $text;
$menu-item-active-background-color: $grey-lighter;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

// Import cytoscape styles
@import "~vue-cytoscape/dist/vue-cytoscape.css";

// Import Vue Resize
@import "~vue-resize/dist/vue-resize.css";
</style>

<style>
.has-text-link {
  color: #3273dc !important;
}
.is-vcentered {
  align-items: center;
}
.is-hcentered {
  justify-content: center;
}
.in-paragraph {
  margin-bottom: 1.5rem;
}
.in-list {
  margin-top: 1rem;
}
.footer-padding {
  padding: 1.5rem 1.5rem 1.5rem !important;
}
.b-table .level {
  padding-bottom: 0rem !important;
}
/* Overwrite tabs' margin mis position*/
.content li + li {
  margin: 0 !important;
}
.is-fullheight {
  height: 100%;
}
.is-anchor {
  padding-top: 60px;
  margin-top: -60px;
}
</style>