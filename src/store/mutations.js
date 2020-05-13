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
  setHSLuv(state, value) {
    state.hsluv = value;
  }
};
