import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import createMutationsSharer from 'vuex-shared-mutations';

import { state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

Vue.use(Vuex);

// Create a persistent store storage
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

// Sync mutations between tabs and windows
const mutationSharer = createMutationsSharer({
  predicate: [
    'setHSLuv',
    'setLetters',
    'setIcons',
    'setBackground',
    'changeBox',
    'addBox',
    'removeBox'
  ]
});

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [vuexLocal.plugin, mutationSharer]
});
