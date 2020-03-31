<template>
  <div class="colorPicker">
    <div class="colorPicker_dot" :style="dot()"></div>
    <input
      type="text"
      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
      class="colorPicker_hex"
      :value="hex"
      @input="updateHSL"
    />
    <range-slider
      :max="360"
      title="Hue"
      suffix="°"
      :value="hue"
      @input="setHue"
    />
    <range-slider
      :max="100"
      title="Saturation"
      suffix="%"
      :value="saturation"
      @input="setSaturation"
    />
    <range-slider
      :max="100"
      title="Lightness"
      suffix="%"
      :value="lightness"
      @input="setLightness"
    />
  </div>
</template>

<script>
import rangeSlider from "./range-slider";
import { hsluvToHex, hexToHsluv } from "hsluv";

export default {
  name: "color-picker",
  components: {
    rangeSlider
  },
  data() {
    return {
      hue: 0,
      saturation: 0,
      lightness: 0,
      hex: "#000"
    };
  },
  methods: {
    dot() {
      return {
        background: this.hex
      };
    },
    setHue(event) {
      this.hue = event;
      this.updateHex();
    },
    setSaturation(event) {
      this.saturation = event;
      this.updateHex();
    },
    setLightness(event) {
      this.lightness = event;
      this.updateHex();
    },
    updateHex() {
      const hsl = [this.hue, this.saturation, this.lightness];
      const hex = hsluvToHex(hsl);
      this.hex = hex;
    },
    updateHSL(event) {
      const hsl = hexToHsluv(event.target.value);
      this.hex = event.target.value;
      this.hue = hsl[0];
      this.saturation = hsl[1];
      this.lightness = hsl[2];
    }
  },
  watch: {
    hex() {
      this.$emit("input", this.hex);
    }
  }
};
</script>

<style lang="scss">
.colorPicker {
  &_hex {
    &:invalid {
      color: red;
    }
  }
  &_dot {
    width: 10vmin;
    height: 10vmin;
  }
}
</style>
