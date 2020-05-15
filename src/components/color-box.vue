<template>
  <div class="ColorBox">
    <div
      class="ColorBox-box"
      :class="{
        '--isActive': active
      }"
    >
      <letters
        class="ColorBox-foreground"
        :style="[{ fill: color }]"
        v-if="letters"
      />
      <div
        class="ColorBox-foreground"
        :style="[{ background: color }]"
        v-else
      ></div>
      <div class="ColorBox-remove" @click.stop="remove"><span>X</span></div>
    </div>
    <div class="ColorBox-score">
      <p class="ColorBox-rating">{{ score }}</p>
      <score-box
        class="ColorBox-ratingAA"
        :score="score"
        :threshold="4.5"
        name="AA"
      />
      <score-box
        class="ColorBox-ratingAA"
        :score="score"
        :threshold="7"
        name="AAA"
      />
    </div>
  </div>
</template>

<script>
import { wcagScore } from '@/utils';
import letters from '@/components/icons/letters';
import scoreBox from '@/components/score-box';

export default {
  name: 'color-box',
  props: ['background', 'color', 'active'],
  components: {
    letters,
    scoreBox
  },
  data() {
    return {};
  },
  computed: {
    letters: {
      get() {
        return this.$store.state.letters;
      }
    },
    score() {
      return wcagScore(this.background, this.color);
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

  &-ratingAA {
    margin-right: 1em;
  }
}
</style>
