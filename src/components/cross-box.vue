<template>
  <div class="CrossBox">
    <div
      class="CrossBox-boxes"
      :class="{ '--isBlank': blank }"
      :style="{ 'background-color': back }"
    >
      <div class="CrossBox-front" v-if="!blank">
        <letters
          class="CrossBox-frontBox"
          :style="{ fill: front }"
          v-if="letters"
        />
        <component
          class="CrossBox-frontBox"
          :style="{ color: front }"
          v-bind:is="$parent.icon"
          v-if="icons"
        />
        <div
          class="CrossBox-frontBox"
          :style="{ 'background-color': front }"
          v-if="!letters && !icons"
        ></div>
      </div>
    </div>
    <div class="CrossBox-score" v-if="!blank">
      <span class="CrossBox-textScore">{{ score }}</span>
      <div>
        <score-box :score="score" :threshold="4.5" name="AA" />
        <score-box :score="score" :threshold="7" name="AAA" />
      </div>
    </div>
  </div>
</template>

<script>
import { wcagScore } from '@/utils';
import Letters from '@/components/icons/letters';
import ScoreBox from '@/components/score-box';
import lorryIcons from '@/mixins/lorry-icons';

export default {
  components: {
    Letters,
    ScoreBox
  },
  mixins: [lorryIcons],
  props: {
    back: {
      type: String,
      required: true
    },
    front: {
      type: String,
      required: true
    }
  },
  computed: {
    blank() {
      return this.back == this.front;
    },
    letters() {
      return this.$store.state.letters;
    },
    icons() {
      return this.$store.state.icons;
    },
    score() {
      return wcagScore(this.back, this.front);
    }
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

.CrossBox {
  display: flex;

  flex-direction: column;

  &-boxes {
    position: relative;

    flex: 1;

    &.--isBlank {
      background-color: var(--color) !important;
      opacity: 0.1;
    }
  }

  &-front {
    position: relative;
    top: 50%;
    left: 50%;

    width: 60%;

    transform: translate(-50%, -50%);

    &::before {
      display: block;
      width: 100%;
      padding-top: (1 / 1) * 100%;

      content: '';
    }
  }

  &-frontBox {
    position: absolute;
    // top: 50%;
    // left: 50%;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    border-radius: 100%;
  }

  &-score {
    @include space-mono();

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0.75em 2em;

    color: var(--inverted);
    font-size: 85%;

    background-color: var(--color);
  }

  .Scorebox {
    filter: invert(100%);

    @media (max-width: 1200px) {
      width: unset;
      padding: 0;

      border: 0;
    }
  }
}
</style>
