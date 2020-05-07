<template>
  <div class="ColorBox">
    <div
      class="ColorBox-box"
      :class="{
        '--isActive': active
      }"
    >
      <div class="ColorBox-foreground" :style="[{ background: color }]"></div>
      <div class="ColorBox-remove" @click.stop="remove"><span>X</span></div>
    </div>
    <div class="ColorBox-score">
      <p class="ColorBox-rating">{{ score }}</p>
      <span class="ColorBox-ratingAA" :class="minScore">AA</span>
      <span class="ColorBox-ratingAAA" :class="extendedScore">AAA</span>
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
        '--isSuccess': this.score >= 4.5
      };
    },
    extendedScore() {
      return {
        '--isSuccess': this.score >= 7
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

.ColorBox {
  text-align: center;

  cursor: pointer;

  &-foreground {
    box-sizing: border-box;
    width: 15vmin;
    height: 15vmin;
    margin-right: auto;
    margin-left: auto;

    border: 2px solid transparent;
    border-radius: 100%;
  }

  &-box.--isActive &-foreground {
    border-color: var(--color);
  }

  &-box {
    position: relative;

    display: inline-block;

    transition: transform 0.5s;

    will-change: transform;

    &.--isActive {
      transform: scale(1.2);
    }
  }

  &-remove {
    position: absolute;
    top: -0.1em;
    right: -1em;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 1em;
    height: 1em;

    font-size: clamp(1.5rem, 4vw, 2.5rem);

    background-color: var(--color);
    border-radius: 100%;
    transform: scale(0);
    transform-origin: left bottom;
    opacity: 0;

    transition: transform 0.5s, opacity 0.35s;

    will-change: transform;

    span {
      @include space-mono;
      color: var(--inverted);

      font-size: 50%;
    }
  }

  &-box.--isActive &-remove {
    transform: scale(0.8);
    opacity: 0.2;

    &:hover {
      transform: scale(1);
      opacity: 1;
    }
  }

  &-score {
    font-size: clamp(22px, 2.5vw, 3rem);
    text-align: center;

    opacity: 0.87;
  }

  &-rating {
    margin: 0.25em 0;
  }

  &-ratingAA,
  &-ratingAAA {
    @include space-mono;
    display: inline-block;
    box-sizing: border-box;
    width: 6em;
    margin-right: 1em;
    padding: 0.25em 0.75em;

    color: var(--color);
    font-weight: bold;
    font-size: max(12px, 0.8vw);

    border: 2px solid var(--color);
    opacity: 0.57;

    transition-duration: 0.5s;
    transition-property: opacity, color, background-color;

    &::after {
      content: ' X';
    }

    &.--isSuccess {
      color: var(--inverted);

      background: var(--color);
      transform-origin: right bottom;
      opacity: 1;

      &::after {
        content: ' OK';
      }
    }
  }

  &-ratingAA {
    margin-right: 1em;
  }
}
</style>
