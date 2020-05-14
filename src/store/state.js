import { randomColor } from '@/utils';

// For first render placeholder data
const bgColor = randomColor();
const boxColor = randomColor();

export const state = {
  hsluv: true,
  letters: false,
  background: bgColor,
  colorBoxes: [boxColor]
};
