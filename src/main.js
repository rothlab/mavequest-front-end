// Import Vue basics
import Vue from 'vue'
import router from './router'

// Register error handler
if (process.env.NODE_ENV != 'development') {
  const Sentry = require('@sentry/browser');
  const Integrations = require('@sentry/integrations');

  Sentry.init({
    dsn: 'https://2fca57c8cda5499086923120812e3b9f@sentry.io/1410585',
    release: process.env.GIT_VERSION,
    integrations: [new Integrations.Vue({ 
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
Vue.config.errorHandler = (err, vm, info) => {
  if (process.env.NODE_ENV !== 'production') {
    Vue.util.warn(`Error in ${info}: "${err.toString()}"`, vm)
  }
  // eslint-disable-next-line
  console.error(err)
}

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
.use(BackToTop)
.use(VueResource)
.use(VueCytoscape)
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