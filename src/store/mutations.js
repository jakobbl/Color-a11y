import Vue from 'vue';

export const mutations = {
  setBackground(state, hex) {
    state.background = hex;
  },
  addBox(state, hex) {
    state.colorBoxes.push(hex);
  },
  changeBox(state, payload) {
    Vue.set(state.colorBoxes, payload.index, payload.hex);
  },
  removeBox(state, index) {
    state.colorBoxes.splice(index, 1);
  },
  overrideBoxesTo(state, arr) {
    if (!Array.isArray(arr)) return;
    state.colorBoxes = arr;
  },
  setHSLuv(state, value) {
    state.hsluv = value;
  },
  setLetters(state, value) {
    if (value === true) {
      state.icons = false;
    }
    state.letters = value;
  },
  setIcons(state, value) {
    if (value === true) {
      state.letters = false;
    }
    state.icons = value;
  }
};
