import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@fortawesome/fontawesome-free/css/all.css'

// Make sure App is loaded last so that the styles are not overwritten
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'fas'
});

new Vue({
  render: h => h(App),
}).$mount('#app');