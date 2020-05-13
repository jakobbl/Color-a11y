import Vue from 'vue';
import VueRouter from 'vue-router';

import Color from '@/views/Color';
import Share from '@/views/Share';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    // dynamic segments start with a colon
    { path: '*', redirect: '/color' },
    { path: '/color', component: Color },
    { path: '/share/:background/:colors', component: Share }
  ]
});
