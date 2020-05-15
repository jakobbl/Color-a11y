import convert from 'color-convert';
import percivedLightness from 'relative-luminance';
import { hex } from 'wcag-contrast';

export function twoDecimals(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomColor(darkMode = false) {
  let lightness;
  if (darkMode) {
    lightness = randomInt(55, 100);
  } else {
    lightness = randomInt(15, 45);
  }
  return '#' + convert.hsl.hex(randomInt(0, 360), randomInt(30, 90), lightness);
}

export function needsDarkMode(hex) {
  const rgb = convert.hex.rgb(hex);
  return percivedLightness(rgb) < 0.45;
}

export function isValidHex(hex) {
  const hexRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  return hexRegex.test(hex);
}

export function wcagScore(background, foreground) {
  const contrast = hex(background, foreground);
  const rounded = twoDecimals(contrast);
  return rounded;
}
