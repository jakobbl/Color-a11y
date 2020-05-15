export const getters = {
  allColors(state) {
    let colorBoxes = state.colorBoxes.slice(0);
    colorBoxes.unshift(state.background);
    return colorBoxes;
  }
};
