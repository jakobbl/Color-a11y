<template>
  <span class="Scorebox" :class="{ '--isSuccess': success }">
    {{ name }}
  </span>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      required: true
    },
    threshold: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    // When the threshold score is met
    success() {
      return this.score >= this.threshold;
    }
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

.Scorebox {
  @include space-mono;
  display: inline-block;
  box-sizing: border-box;
  width: 6em;
  margin-right: 1em;
  padding: 0.25em 0.75em;

  color: var(--color);
  font-weight: bold;
  font-size: max(12px, 0.8vw);
  text-align: center;

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
</style>
