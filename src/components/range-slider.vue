<template>
  <div class="range-slider">
    <div class="range-slider_value">
      <input
        type="number"
        min="0"
        step="0.1"
        :max="max"
        :value="valueClamp"
        @keyup="handleInput"
      />
      <span>{{ suffix }}</span>
    </div>
    <input
      type="range"
      min="0"
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
      valueClamp: null
    };
  },
  methods: {
    handleInput(event) {
      let val = parseInt(event.target.value);
      val = Math.min(Math.max(val, 0), this.max);
      this.valueClamp = val;
      this.$emit('input', val);
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
    }
  }

  &_title {
    width: 10ch;
    margin-left: 1em;

    font-size: 1rem;

    text-align: left;
  }

  &_slider {
    flex: 1;

    color: var(--color);

    &:focus,
    &:hover,
    &:active {
      outline: none;
    }
  }
}
</style>
