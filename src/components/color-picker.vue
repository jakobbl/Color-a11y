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
        <img
          svg-inline
          class="ColorPicker-errorIcon"
          src="../assets/error.svg"
        />
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

import rangeSlider from '@/components/range-slider';

export default {
  name: 'color-picker',
  components: {
    rangeSlider
  },
  data() {
    return {
      hue: undefined,
      saturation: undefined,
      lightness: undefined,
      hex: null
    };
  },
  computed: {
    placeholder() {
      if (this.hex) {
        return this.hex;
      } else {
        return '#aabbcc';
      }
    },
    hsluv: {
      get() {
        return this.$store.state.hsluv;
      }
    }
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
      let hex;

      if (this.hsluv) {
        hex = hsluvToHex([this.hue, this.saturation, this.lightness]);
      } else {
        hex =
          '#' + colorConvert.hsl.hex(this.hue, this.saturation, this.lightness);
      }

      this.hex = hex;
    },
    updateHSL(hex) {
      // Early exit
      const hexRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      if (!hexRegex.test(hex)) return;

      let hsl;
      if (this.hsluv) {
        hsl = hexToHsluv(hex);
      } else {
        hsl = colorConvert.hex.hsl(hex);
      }

      this.hex = hex;
      this.hue = hsl[0];
      this.saturation = hsl[1];
      this.lightness = hsl[2];
    },
    formatHex(event) {
      const input = event.target.value;
      const firstChar = input.slice(0, 1);
      if (input.length <= 6 && input.length >= 3 && firstChar !== '#') {
        const newHex = '#' + input;
        this.updateHSL(newHex);
      }
    },
    rounded(value) {
      return Math.round(value * 10) / 10;
    },
    setTo(hex) {
      this.updateHSL(hex);
      this.hex = hex;
    }
  },
  watch: {
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
    margin-bottom: 3vmax;
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

    height: 1em;

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
      stroke-width: 1em;
    }
  }

  &-slider {
    width: 55vmax;
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
