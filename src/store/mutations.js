export const mutations = {
  setBackground(state, hex) {
    state.background = hex;
  },
  addBox(state, hex) {
    state.colorBoxes.push(hex);
  },
  changeBox(state, payload) {
    state.colorBoxes[payload.index] = payload.hex;
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
    state.letters = value;
  }
};
