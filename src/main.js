import Vue from 'vue';

import store from '@/store';
import router from '@/router';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
