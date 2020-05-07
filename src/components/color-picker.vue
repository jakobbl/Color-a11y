<template>
  <div class="color-picker">
    <div class="color-picker_hexInput">
      <input
        type="text"
        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        :placeholder="placeholder"
        maxlength="7"
        class="color-picker_hex"
        :value="hex"
        @change="formatHex"
        @input="updateHSL($event.target.value)"
      />
      <p class="color-picker_error">
        <img
          svg-inline
          class="color-picker_errorIcon"
          src="../assets/error.svg"
        />
      </p>
      <!-- <p class="color-picker_error --isLeft">
        <img
          svg-inline
          class="color-picker_errorIcon"
          src="../assets/error.svg"
        />
      </p> -->
    </div>
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
      const hsl = [this.hue, this.saturation, this.lightness];
      const hex = hsluvToHex(hsl);
      this.hex = hex;
    },
    updateHSL(hex) {
      // Early exit
      const hexRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      if (!hexRegex.test(hex)) return;

      const hsl = hexToHsluv(hex);
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

.color-picker {
  text-align: center;

  &_hexInput {
    position: relative;

    display: inline-block;
    margin-bottom: 3vmax;
  }

  &_hex {
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

    &:invalid:not(:focus) ~ .color-picker_error {
      opacity: 1;
    }
  }

  &_error {
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

    // &.--isLeft {
    //   right: -10%;

    //   text-align: left;

    //   transform: translate(100%, -50%);
    // }

    // &.--isLeft &Icon {
    //   transform: rotate(180deg);
    // }
  }

  &_slider {
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
