<template>
  <div
    id="app"
    :class="{ '-isDark': isDark }"
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
      <color-picker
        @input="colorChange($event)"
        class="app_picker"
        ref="colorPicker"
      />
      <button class="app_colorBox-add" @click="addColorBox">Add color</button>
    </div>
  </div>
</template>

<script>
import { randomColor, needsDarkMode } from '@/utils';
import ColorPicker from '@/components/color-picker';
import ColorBox from '@/components/color-box';

export default {
  name: 'App',
  components: {
    ColorPicker,
    ColorBox
  },
  data() {
    // For first render placeholder data
    const bgColor = randomColor();
    const boxColor = randomColor();
    const darkMode = needsDarkMode(bgColor);

    return {
      background: bgColor,
      colorBoxes: [boxColor],
      colorBoxesMeta: [
        {
          color: boxColor,
          active: false
        }
      ],
      activeColorBox: -1,
      isDark: darkMode
    };
  },
  mounted() {
    this.$refs.colorPicker.setTo(this.background);
  },
  methods: {
    updateColorBoxMeta() {
      this.colorBoxesMeta = this.colorBoxes.map((color, index) => {
        return {
          color,
          active: index === this.activeColorBox
        };
      });
    },
    addColorBox() {
      let newColor = randomColor(this.isDark);
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
        this.isDark = needsDarkMode(event.hex);
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
  --inverted: #fff;
  @include montserrat;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: calc(100vh - 10vmin);
  padding: 5vmin;

  color: var(--color);

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* stylelint-disable-next-line */
  &.-isDark {
    --color: #fff;
    --inverted: #000;
  }
}

.app {
  &_logo {
    width: 100%;
    margin: 0;
    margin-bottom: 3vmax;

    font-size: 1.5rem;
    text-align: center;

    transition: color 0.5s ease-in-out;
  }

  &_content {
    flex: 1;

    text-align: center;
  }

  &_picker {
    width: 100%;
    margin: 3vmax 0;
  }

  &_colorBoxes {
    display: grid;
    grid-gap: 5vmin;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    width: 100%;
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
      @include space-mono;
      display: inline-flex;
      align-items: center;
      padding: 1em;

      color: var(--color);

      font-size: 75%;

      background-color: transparent;
      border: 2px solid var(--color);
      opacity: 0.57;

      transition: background-color 0.25s, opacity 0.35s;

      &:hover,
      &:active {
        color: var(--inverted);

        background-color: var(--color);
        opacity: 1;
      }
    }
  }
}
</style>
