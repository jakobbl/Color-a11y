<template>
  <div class="ColorPicker">
    <div class="ColorPicker-hexInput">
      <input
        type="text"
        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        :placeholder="placeholder"
        maxlength="7"
        class="ColorPicker-hex"
        :value="hex"
        @change="formatHex"
        @input="updateHSL($event.target.value)"
      />
      <p class="ColorPicker-error">
        <error-arrow class="ColorPicker-errorIcon" />
      </p>
    </div>
    <range-slider
      :max="360"
      title="Hue"
      suffix="°"
      :value="rounded(hue)"
      @input="setHue"
      class="ColorPicker-slider"
    />
    <range-slider
      :max="100"
      title="Saturation"
      suffix="%"
      :value="rounded(saturation)"
      @input="setSaturation"
      class="ColorPicker-slider"
    />
    <range-slider
      :max="100"
      title="Lightness"
      suffix="%"
      :value="rounded(lightness)"
      @input="setLightness"
      class="ColorPicker-slider"
    />
  </div>
</template>

<script>
import colorConvert from 'color-convert';
import { hsluvToHex, hexToHsluv } from 'hsluv';
import { isValidHex } from '@/utils';

import rangeSlider from '@/components/range-slider';
import errorArrow from '@/components/icons/error-arrow';

export default {
  name: 'color-picker',
  components: {
    rangeSlider,
    errorArrow
  },
  data() {
    return {
      // Slider values
      hue: undefined,
      saturation: undefined,
      lightness: undefined,
      // Input field value
      hex: null
    };
  },
  computed: {
    // Placeholder text for hex input
    placeholder() {
      if (this.hex) {
        return this.hex;
      } else {
        return '#aabbcc';
      }
    },
    // Vuex
    hsluv: {
      get() {
        return this.$store.state.hsluv;
      }
    }
  },
  methods: {
    // Set slider values
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
    // Calculate the hex code
    updateHex() {
      let hex;

      // Check for HSLuv UI option
      if (this.hsluv) {
        hex = hsluvToHex([this.hue, this.saturation, this.lightness]);
      } else {
        hex =
          '#' + colorConvert.hsl.hex(this.hue, this.saturation, this.lightness);
      }

      this.hex = hex;
    },
    // Calculate the HSL values
    updateHSL(hex) {
      // Early exit for non-valid hex code
      if (!isValidHex(hex)) return;

      let hsl;
      if (this.hsluv) {
        hsl = hexToHsluv(hex);
      } else {
        hsl = colorConvert.hex.hsl(hex);
      }

      // Update slider values
      this.hex = hex;
      this.hue = hsl[0];
      this.saturation = hsl[1];
      this.lightness = hsl[2];
    },
    // "Pretty-print" the hex code
    formatHex(event) {
      const input = event.target.value;
      const firstChar = input.slice(0, 1);
      if (input.length <= 6 && input.length >= 3 && firstChar !== '#') {
        const newHex = '#' + input;
        this.updateHSL(newHex);
      }
    },
    // Round the 1 decimal places
    rounded(value) {
      return Math.round(value * 10) / 10;
    },
    // Override the sliders values from a provided hex code
    setTo(hex) {
      this.updateHSL(hex);
      this.hex = hex;
    }
  },
  watch: {
    // Emit every time there a new hex code
    hex() {
      this.$emit('input', { hex: this.hex });
    }
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

.ColorPicker {
  text-align: center;

  &-hexInput {
    position: relative;

    display: inline-block;
    margin-bottom: 3vmin;
  }

  &-hex {
    @include montserrat;

    box-sizing: border-box;
    width: 9ch;
    padding: 0.25em 0.5em;

    color: var(--color);
    font-size: 1.5rem;
    text-align: center;

    background: transparent;
    border: 2px solid transparent;
    border-bottom: 2px solid var(--color);

    // Invalid state but does not have :focus
    &:invalid:not(:focus) {
      color: var(--color);

      background-color: var(--invalid);
      border: 2px solid;
    }

    &:invalid:not(:focus) ~ .ColorPicker-error {
      opacity: 1;
    }

    &::placeholder {
      color: var(--color);

      opacity: 0.37;
    }
  }

  &-error {
    position: absolute;
    top: 50%;
    left: -10%;

    margin: 0;

    text-align: right;

    transform: translate(-100%, -50%);
    opacity: 0;

    transition-duration: 0.5s;
    transition-property: background-color, border, opacity;

    &Icon {
      height: 100%;

      fill: none;
      stroke: var(--color);
    }
  }

  &-slider {
    width: 90%;
    width: min(80%, 1000px);
    margin-right: auto;
    margin-bottom: 0.5em;
    margin-left: auto;

    color: var(--color);

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
