import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'


Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'fas'
});

new Vue({
  render: h => h(App),
}).$mount('#app');