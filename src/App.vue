<template>
  <div
    id="app"
    :class="{ '--isDark': isDark }"
    :style="[{ background: background }, { '--background': background }]"
  >
    <h1 class="app_logo">Color a11y</h1>
    <div class="app_content">
      <div class="app_colorBoxes">
        <color-box
          v-for="(box, index) in colorBoxesMeta"
          :key="index"
          :background="background"
          :color="box.color"
          :active="box.active"
          @click.native="selectColorBox(index)"
          @remove="removeColorBox(index)"
          class="app_colorBox"
          :class="{
            '--faded': shouldFadeOut(box.active),
            '--selected': box.active
          }"
        />
      </div>
      <div class="app_colorBox-add" @click="addColorBox">
        <img svg-inline src="@/assets/add.svg" />
      </div>
      <color-picker
        @input="colorChange($event)"
        class="app_picker"
        ref="colorPicker"
      />
    </div>
  </div>
</template>

<script>
import convert from 'color-convert';
import percivedLightness from 'relative-luminance';

import { getRandomInt } from '@/utils';
import ColorPicker from '@/components/color-picker';
import ColorBox from '@/components/color-box';

export default {
  name: 'App',
  components: {
    ColorPicker,
    ColorBox
  },
  data() {
    return {
      background: '',
      colorBoxes: [],
      colorBoxesMeta: [],
      activeColorBox: -1,
      isDark: false
    };
  },
  mounted() {
    this.colorBoxes.push(this.generatePlaceholderColor());
    this.updateColorBoxMeta();
  },
  methods: {
    generatePlaceholderColor() {
      let lightness;
      if (this.isDark) {
        lightness = getRandomInt(55, 100);
      } else {
        lightness = getRandomInt(0, 45);
      }
      return (
        '#' +
        convert.hsl.hex(getRandomInt(0, 360), getRandomInt(20, 100), lightness)
      );
    },
    updateColorBoxMeta() {
      this.colorBoxesMeta = this.colorBoxes.map((color, index) => {
        return {
          color,
          active: index === this.activeColorBox
        };
      });
    },
    addColorBox() {
      let newColor = this.generatePlaceholderColor();
      this.colorBoxes.push(newColor);
      this.$nextTick(() => {
        this.updateColorBoxMeta();
        setTimeout(() => {
          this.activeColorBox = this.colorBoxes.length - 1;
          this.$refs.colorPicker.setTo(newColor);
        }, 125);
      });
    },
    removeColorBox(index) {
      this.activeColorBox = -1;
      this.$refs.colorPicker.setTo(this.background);
      this.colorBoxes.splice(index, 1);
      this.$nextTick(() => {
        this.updateColorBoxMeta();
      });
    },
    selectColorBox(index) {
      if (this.activeColorBox === index) {
        this.activeColorBox = -1;
        this.$refs.colorPicker.setTo(this.background);
      } else {
        this.activeColorBox = index;
        this.$refs.colorPicker.setTo(this.colorBoxes[index]);
      }
      this.updateColorBoxMeta();
    },
    colorChange(event) {
      if (this.activeColorBox >= 0) {
        this.colorBoxes[this.activeColorBox] = event.hex;
        this.updateColorBoxMeta();
      } else {
        this.background = event.hex;
        const pl = percivedLightness(event.rgb);

        if (pl < 0.45) {
          this.isDark = true;
        } else {
          this.isDark = false;
        }
      }
    },
    shouldFadeOut(activeState) {
      return this.activeColorBox !== -1 && !activeState;
    }
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

body,
html {
  margin: 0;
}

/* stylelint-disable-next-line */
#app {
  --color: #000;
  @include montserrat;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: calc(100vh - 10vmin);
  padding: 5vmin;

  color: var(--color);

  transition: color 1s ease-in-out;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* stylelint-disable-next-line */
  &.--isDark {
    --color: #fff;
  }
}

.app {
  &_logo {
    width: 100%;
    margin: 0;
    margin-bottom: 5vmin;

    font-size: 1.5rem;
    text-align: center;
  }

  &_content {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: center;
  }

  &_picker {
    width: 100%;
  }

  &_colorBoxes {
    display: grid;
    grid-gap: 5vmin;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    width: 100%;
    margin-bottom: 5vmin;
  }

  &_colorBox {
    transition: opacity 1s, transform 0.25s;

    will-change: opacity, transform;

    &.--faded {
      opacity: 0.37;
    }

    // &.--selected {
    // }

    &-add {
      width: 2rem;
      height: 2rem;

      svg {
        fill: currentColor;
      }
    }
  }
}
</style>
