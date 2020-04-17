<template>
  <div class="color-picker">
    <input
      type="text"
      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
      class="color-picker_hex"
      :value="hex"
      @input="updateHSL($event.target.value)"
    />
    <div class="flex-breaker" />
    <range-slider
      :max="360"
      title="Hue"
      suffix="°"
      :value="rounded(hue)"
      @input="setHue"
      class="color-picker_slider"
    />
    <range-slider
      :max="100"
      title="Saturation"
      suffix="%"
      :value="rounded(saturation)"
      @input="setSaturation"
      class="color-picker_slider"
    />
    <range-slider
      :max="100"
      title="Lightness"
      suffix="%"
      :value="rounded(lightness)"
      @input="setLightness"
      class="color-picker_slider"
    />
  </div>
</template>

<script>
import { hsluvToHex, hexToHsluv } from 'hsluv';
import convert from 'color-convert';

import { twoDecimals } from '@/utils';
import rangeSlider from '@/components/range-slider';

export default {
  name: 'color-picker',
  components: {
    rangeSlider
  },
  data() {
    return {
      hue: 0,
      saturation: 0,
      lightness: 87,
      hex: null
    };
  },
  methods: {
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
    updateHSL(hex) {
      const hsl = hexToHsluv(hex);
      this.hex = hex;
      this.hue = hsl[0];
      this.saturation = hsl[1];
      this.lightness = hsl[2];
    },
    rounded(value) {
      return twoDecimals(value);
    },
    setTo(hex) {
      this.updateHSL(hex);
      this.hex = hex;
    }
  },
  watch: {
    hex() {
      const rgb = convert.hex.rgb(this.hex);
      this.$emit('input', { hex: this.hex, rgb });
    }
  },
  mounted() {
    this.updateHex();
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

.color-picker {
  text-align: center;

  &_hex {
    @include montserrat;
    width: 9ch;
    margin-bottom: 3vmin;
    padding: 0.25em 0.5em;

    color: var(--color);
    font-size: 1.5rem;
    text-align: center;

    background: transparent;
    border: 0;
    border-bottom: 2px solid var(--color);

    transition: color 1s ease-in-out, border-color 1s ease-in-out;

    &:invalid {
      color: #f00;
    }
  }

  &_slider {
    width: 45vw;
    margin-right: auto;
    margin-bottom: 0.5em;
    margin-left: auto;

    color: currentColor;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
