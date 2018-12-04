// Import Vue basics
import Vue from 'vue'
import router from './router'

// Import UI framework related libraries
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bulma-divider'

// Import plugins
import VueObserveVisibility from 'vue-observe-visibility'
import BackToTop from 'vue-backtotop'

// Make sure App is loaded last so that the styles are not overwritten
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
.use(VueObserveVisibility)
.use(BackToTop);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');