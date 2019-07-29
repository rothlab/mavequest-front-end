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
        <div class="level" :class="{ 'is-mobile': isTablet }">
          <div class="level-left">
            <p :class="{ 'has-text-centered': isMobile }">
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
      isActive: 'search',
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1023,
      hasAgreedToCompliance: false
    };
  },
  methods: {
    updateActiveNavbarItem(value) {
      this.isActive = value;
    }
  },
  mounted() {
      // Read compliance status
      const complianceStats = window.localStorage.getItem('hasAgreedToCompliance');
      if (complianceStats) {
        this.hasAgreedToCompliance = complianceStats === "true";
      }
      
      // Display Compliance popup
      if (!this.hasAgreedToCompliance) {
        this.$snackbar.open({
          message: 'We use cookies to offer you a better experience.<br >' +
          'By using the service, you agree to our ' + 
          '<a href="/docs/tos" class="has-text-light"><u>Terms</u></a> and ' +
          '<a href="/docs/privacy" class="has-text-light"><u>Privacy Policies</u></a>.',
          type: 'is-warning',
          indefinite: true,
          actionText: 'I Agree',
          onAction: () => {
            this.hasAgreedToCompliance = true;
          }
        })
      }
    },
  watch: {
    hasAgreedToCompliance(newVal) {
      window.localStorage.setItem('hasAgreedToCompliance', newVal.toString());
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