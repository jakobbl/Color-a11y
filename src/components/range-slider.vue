<template>
  <div class="range-slider">
    <div class="range-slider_value">
      <input
        type="number"
        :min="min"
        step="0.1"
        :max="max"
        :value="valueClamp"
        @input="handleInput"
        @change="formatInput"
      />
      <span>{{ suffix }}</span>
    </div>
    <input
      type="range"
      :min="min"
      step="0.1"
      :max="max"
      class="range-slider_slider range-input"
      @input="handleInput"
      :value="valueClamp"
    />
    <span class="range-slider_title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'range-slider',
  props: ['value', 'title', 'max', 'suffix'],
  data() {
    return {
      valueClamp: null,
      min: 0
    };
  },
  methods: {
    handleInput(event) {
      let val = parseInt(event.target.value);
      if (isNaN(val)) return;
      val = Math.min(Math.max(val, this.min), this.max);
      this.valueClamp = val;
      this.$emit('input', val);
    },
    formatInput(event) {
      let val = parseInt(event.target.value);
      if (isNaN(val)) {
        event.target.value = this.valueClamp;
      } else {
        event.target.value = Math.min(Math.max(val, this.min), this.max);
      }
    }
  },
  mounted() {
    this.valueClamp = this.value;
  },
  watch: {
    value() {
      this.valueClamp = this.value;
    }
  }
};
</script>

<style lang="scss">
@import '@/scss/global';
@import '@/scss/_input-range';

.range-slider {
  @include space-mono;
  display: flex;

  color: var(--color);

  &_value {
    margin-right: 1em;

    text-align: right;

    input {
      display: inline-block;
      box-sizing: border-box;
      margin-right: 0.125em;

      color: currentColor;
      font-size: 1rem;
      text-align: right;

      background: none;
      border: 0;

      &:focus,
      &:hover {
        border-bottom: 1px solid;
        outline: none;
      }

      // &:invalid {
      //   color: var(--inverted);

      //   background-color: var(--color);
      // }
    }
  }

  &_title {
    width: 10ch;
    margin-left: 1em;

    font-size: 1rem;

    text-align: left;

    transform-origin: center left;

    transition: transform 0.25s;
  }

  &_slider {
    flex: 1;

    color: var(--color);

    opacity: 0.57;

    transition: opacity 0.35s;

    &:focus,
    &:hover,
    &:active {
      outline: none;
    }
  }

  &:hover,
  &:focus,
  &:active {
    .range-slider_title {
      font-weight: bold;

      transform: scale(1.15);
    }
    .range-slider_slider {
      opacity: 1;
    }
  }
}
</style>
