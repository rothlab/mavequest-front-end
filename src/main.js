// Import Vue basics
import Vue from 'vue'
import router from './router'

// Import UI framework related libraries
import Buefy from 'buefy'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bulma-divider'

// Import plugins
import VueObserveVisibility from 'vue-observe-visibility'
import BackToTop from 'vue-backtotop'
import VueResource from 'vue-resource'
import VueCytoscape from 'vue-cytoscape'
import VueResize from 'vue-resize'
import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'

// Make sure App is loaded last so that the styles are not overwritten
import App from './App.vue'

// Define instance properties
if (process.env.NODE_ENV == 'development') {
  Vue.prototype.$apiEntryPoint = 'http://localhost:3001';
} else {
  Vue.prototype.$apiEntryPoint = 'https://api.mavequest.varianteffect.org';
}

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
.use(VueObserveVisibility)
.use(BackToTop)
.use(VueResource)
.use(VueCytoscape)
.use(VueResize)
.use(VueScrollTo)
.use(VueAnalytics, {
  id: 'UA-133761986-1',
  router,
  autoTracking: {
    exception: true,
    exceptionLogs: false
  },
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');