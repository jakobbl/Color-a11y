import Vue from 'vue';
import VueRouter from 'vue-router';

import Color from '@/views/Color';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    // dynamic segments start with a colon
    { path: '/', component: Color }
  ]
});
