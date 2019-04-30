// Import Vue basics
import Vue from 'vue'
import router from './router'
import * as Sentry from '@sentry/browser'

// Register error handler
if (process.env.NODE_ENV != 'development') {
  
  Sentry.init({
    dsn: 'https://2fca57c8cda5499086923120812e3b9f@sentry.io/1410585',
    release: process.env.GIT_COMMITHASH,
    integrations: [new Sentry.Integrations.Vue({ 
      Vue,
      attachProps: true
    })]
  })
}

// Import UI framework related libraries
import Buefy from 'buefy'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bulma-divider'

// Import plugins
import BackToTop from 'vue-backtotop'
import VueResource from 'vue-resource'
import VueCytoscape from 'vue-cytoscape'
import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'
import VueResize from 'vue-resize'
import VueScrollactive from 'vue-scrollactive'

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
.use(BackToTop)
.use(VueResource)
.use(VueCytoscape)
.use(VueScrollTo)
.use(VueAnalytics, {
  id: 'UA-133761986-1',
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})
.use(VueResize)
.use(VueScrollactive);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');