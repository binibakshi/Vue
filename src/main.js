import Vue from 'vue'
import App from './App.vue'
import router from './router'
import jQuery from  'jquery';

window.$ = window.jQuery = jQuery;

import vuetify from './plugins/vuetify';
import 'popper.js'
import { store } from './store/store';
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

