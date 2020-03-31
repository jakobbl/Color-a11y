<template>
  <div class="rangeSlider">
    <span class="rangeSlider-value">{{ value }}{{ suffix }}</span>
    <input
      type="range"
      min="0"
      :max="max"
      class="rangeSlider-slider"
      @input="handleInput"
      :value="value"
    />
    <span class="rangeSlider-title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: "range-slider",
  props: ["value", "title", "max", "suffix"],
  data() {
    return {};
  },
  methods: {
    handleInput(event) {
      this.value = parseInt(event.target.value);
      this.$emit("input", parseInt(event.target.value));
    }
  }
};
</script>

<style lang="scss">
.rangeSlider {
  //
}
</style>
