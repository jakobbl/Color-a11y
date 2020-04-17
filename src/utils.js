export function twoDecimals(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
