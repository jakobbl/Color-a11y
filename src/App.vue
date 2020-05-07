<template>
  <div
    id="App"
    :class="{ '--isDark': isDark }"
    :style="[{ background: background }, { '--background': background }]"
  >
    <h1 class="App-logo">Color a11y</h1>
    <div class="App-content">
      <div class="App-colorBoxes">
        <transition-group name="ColorBoxList" tag="div" appear>
          <color-box
            v-for="(box, index) in colorBoxesMeta"
            :key="`${box}-${index}`"
            :background="background"
            :color="box.color"
            :active="box.active"
            @click.native="selectColorBox(index)"
            @remove="removeColorBox(index)"
            class="App-colorBox"
            :class="{
              '--isFaded': shouldFadeOut(box.active),
              '--isSelected': box.active
            }"
          />
        </transition-group>
      </div>
      <color-picker
        @input="colorChange($event)"
        class="App-picker"
        ref="colorPicker"
      />
      <button class="App-colorBoxAdd" @click="addColorBox">Add color</button>
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
#App {
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
  &.--isDark {
    --color: #fff;
    --inverted: #000;
    --invalid: rgb(255, 45, 45);
  }
}

.App {
  &-logo {
    width: 100%;
    margin: 0;
    margin-bottom: 3vmax;

    font-size: 1.5rem;
    text-align: center;

    transition: color 0.5s ease-in-out;
  }

  &-content {
    flex: 1;

    text-align: center;
  }

  &-picker {
    width: 100%;
    margin: 3vmax 0;
  }

  &-colorBoxes > div {
    display: grid;
    grid-gap: 5vmin;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    width: 100%;
  }

  &-colorBox {
    transition: opacity 1s, transform 0.25s;

    will-change: opacity, transform;

    &.--isFaded {
      opacity: 0.37;
    }

    &Add {
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

.ColorBoxList {
  &-enter-active {
    transition: opacity 0.5s, transform 0.35s;
  }

  &-leave-active {
    transition: opacity 0.25s, transform 0.35s;
  }

  &-enter,
  &-leave-to {
    transform: translateY(20%);
    opacity: 0;
  }
}
</style>
