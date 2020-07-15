import Vue from 'vue'
import App from './App.vue'
import router from './router'
import jQuery from  'jquery';

window.$ = window.jQuery = jQuery;

import vuetify from './plugins/vuetify';
import 'popper.js'
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

