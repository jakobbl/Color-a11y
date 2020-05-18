<template>
  <div class="RangeSlider">
    <div class="RangeSlider-value">
      <input
        type="number"
        :min="min"
        step="0.1"
        :max="max"
        :value="valueClamp"
        @input="handleInput"
        @change="formatInput"
        :size="inputSize"
      />
      <span>{{ suffix }}</span>
    </div>
    <input
      type="Range"
      :min="min"
      step="0.1"
      :max="max"
      class="RangeSlider-slider Range-input"
      @input="handleInput"
      :value="valueClamp"
    />
    <span class="RangeSlider-title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'range-slider',
  props: {
    value: {
      type: Number,
      required: true
    },
    title: {
      type: String
    },
    max: {
      type: Number,
      required: true
    },
    suffix: {
      type: String
    }
  },
  data() {
    return {
      valueClamp: null,
      min: 0
    };
  },
  computed: {
    // The number for the input size attribute
    inputSize() {
      const n = this.max.toString().length;
      return n + 2;
    }
  },
  methods: {
    // Handle input value
    handleInput(event) {
      const input = event.target.value.replace(',', '.');
      let val = parseFloat(input).toFixed(1);
      if (isNaN(val)) return;
      val = Math.min(Math.max(val, this.min), this.max);
      this.valueClamp = val;
      this.$emit('input', val);
    },
    // "Pretty-print" the input value
    formatInput(event) {
      const input = event.target.value.replace(',', '.');
      let val = parseFloat(input).toFixed(1);
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

.RangeSlider {
  @include space-mono;
  display: flex;

  color: var(--color);

  &-value {
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

  &-title {
    width: 10ch;
    margin-left: 1em;

    font-size: 1rem;

    text-align: left;

    transform-origin: center left;

    transition: transform 0.25s;
  }

  &-slider {
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
    .RangeSlider-title {
      font-weight: bold;

      transform: scale(1.15);
    }

    .RangeSlider-slider {
      opacity: 1;
    }
  }
}
</style>
