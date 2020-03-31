<template>
  <div class="colorBox">
    <div class="colorBox_background" :style="[{ background: background }]">
      <div
        class="colorBox_foreground"
        :style="[{ background: foreground }]"
      ></div>
    </div>
    <div class="colorBox_score">
      <p class="colorbox_rating">{{ score }}</p>
      <span class="colorBox_ratingAA" :class="minScore">AA</span>
      <span class="colorBox_ratingAAA" :class="extendedScore">AAA</span>
    </div>
  </div>
</template>

<script>
import { hex } from "wcag-contrast";

export default {
  name: "color-box",
  props: ["background", "foreground"],
  components: {},
  data() {
    return {};
  },
  computed: {
    score() {
      const contrast = hex(this.background, this.foreground);
      const rounded = Math.round((contrast + Number.EPSILON) * 100) / 100;
      return rounded;
    },
    minScore() {
      return {
        "--success": this.score >= 4.5
      };
    },
    extendedScore() {
      return {
        "--success": this.score >= 7
      };
    }
  }
};
</script>

<style lang="scss">
.colorBox {
  &_background {
    width: 10vmin;
    height: 10vmin;
    padding: 5vmin;
  }
  &_foreground {
    width: 10vmin;
    height: 10vmin;
    border-radius: 100%;
  }
  &_ratingAA,
  &_ratingAAA {
    &:after {
      content: " X ";
    }
    &.--success {
      &:after {
        content: " √ ";
      }
    }
  }
}
</style>
