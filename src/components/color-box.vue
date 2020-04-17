<template>
  <div class="color-box">
    <div
      class="color-box_foreground"
      :class="{
        '--active': active
      }"
      :style="[{ background: color }]"
    ></div>
    <div class="color-box_score">
      <p class="color-box_rating">{{ score }}</p>
      <div class="color-box_ratingAA" :class="minScore"><span>AA</span></div>
      <div class="color-box_ratingAAA" :class="extendedScore">
        <span>AAA</span>
      </div>
    </div>
  </div>
</template>

<script>
import { hex } from 'wcag-contrast';
import { twoDecimals } from '@/utils';

export default {
  name: 'color-box',
  props: ['background', 'color', 'active'],
  components: {},
  data() {
    return {};
  },
  computed: {
    score() {
      const contrast = hex(this.background, this.color);
      const rounded = twoDecimals(contrast);
      return rounded;
    },
    minScore() {
      return {
        '--success': this.score >= 4.5
      };
    },
    extendedScore() {
      return {
        '--success': this.score >= 7
      };
    },
    needsContrastBorder() {
      if (this.score < 1.35) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss">
@import '@/scss/global';

.color-box {
  position: relative;

  &_foreground {
    box-sizing: border-box;
    width: 15vmin;
    height: 15vmin;
    margin-right: auto;
    margin-left: auto;

    border: 2px solid transparent;
    border-radius: 100%;

    transition: transform 0.5s;

    &.--active {
      border-color: currentColor;
      transform: scale(1.2);
    }
  }

  &_score {
    margin-top: 1.25rem;

    text-align: center;

    opacity: 0.87;
  }

  &_rating {
    margin: 0.75em 0;

    font-size: 1.75rem;
  }

  &_ratingAA,
  &_ratingAAA {
    @include space-mono;
    display: inline-block;
    box-sizing: border-box;
    width: 6em;
    margin-right: 1em;
    padding: 0.25em 0.75em;

    font-weight: bold;
    font-size: 75%;

    border: 2px solid;
    border-radius: 3em;
    opacity: 0.57;

    transition: font-weight 0.25s, transform 0.25s;
    transition: opacity 0.35s, background-color 0.75s;
    transition-delay: 0;

    span {
      transition: filter 0.75s;
    }

    span::after {
      content: ' X';
    }

    &.--success {
      background: currentColor;
      transform-origin: right bottom;
      opacity: 1;

      transition-delay: 0.125s;

      span {
        filter: invert(100%);
      }

      span::after {
        content: ' OK';
      }
    }
  }

  &_ratingAA {
    margin-right: 1em;
  }
}
</style>
