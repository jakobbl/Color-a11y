<template>
  <div class="color-box">
    <div
      class="color-box_box"
      :class="{
        '--active': active
      }"
    >
      <div class="color-box_foreground" :style="[{ background: color }]"></div>
      <div class="color-box_remove" @click.stop="remove"><span>X</span></div>
    </div>
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
  methods: {
    remove() {
      this.$emit('remove');
    }
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

.color-box {
  text-align: center;

  &_foreground {
    box-sizing: border-box;
    width: 15vmin;
    height: 15vmin;
    margin-right: auto;
    margin-left: auto;

    border: 2px solid transparent;
    border-radius: 100%;
  }

  &_box.--active &_foreground {
    border-color: currentColor;
  }

  &_box {
    position: relative;

    display: inline-block;

    transition: transform 0.5s;

    will-change: transform;

    &.--active {
      transform: scale(1.2);
    }
  }

  &_remove {
    position: absolute;
    top: -1vmin;
    right: -3vmin;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 4vmin;
    height: 4vmin;

    background-color: currentColor;
    border-radius: 100%;
    transform: scale(0);
    transform-origin: left bottom;
    opacity: 0;

    transition: transform 0.5s, opacity 0.35s;

    will-change: transform;

    span {
      @include space-mono;
      filter: invert(100%);
    }
  }

  &_box.--active &_remove {
    transform: scale(1);
    opacity: 1;
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
