<template>
  <div
    class="Color"
    :class="{ '--isDark': isDark }"
    :style="[{ background: background }, { '--background': background }]"
  >
    <div class="Color-top">
      <h1 class="Color-logo">Color a11y</h1>
      <div class="Color-options">
        <div class="CrossGrid-optionsGroup">
          <div
            class="Color-option"
            @click="hsluv = !hsluv"
            :class="{ '--isInactive': !hsluv }"
          >
            <colorspace-icon class="Color-optionIcon" />
            <span class="Color-optionLabel">HSLuv</span>
          </div>
          <div
            class="Color-option"
            @click="letters = !letters"
            :class="{ '--isInactive': !letters }"
          >
            <letters-icon class="Color-optionIcon" />
            <span class="Color-optionLabel">Letters</span>
          </div>
        </div>
        <div class="CrossGrid-optionsGroup">
          <div class="Color-option">
            <external-icon class="Color-optionIcon" />
            <router-link
              to="/crossgrid"
              class="Color-optionLabel"
              target="_blank"
              >CrossGrid</router-link
            >
          </div>
          <div class="Color-option">
            <share-icon class="Color-optionIcon" />
            <span class="Color-optionLabel" @click="copyShareLink">{{
              shareLinkText
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="Color-content"> -->
    <div class="Color-colorBoxes">
      <transition-group name="ColorBoxList" tag="div" appear>
        <color-box
          v-for="(box, index) in colorBoxesMeta"
          :key="`${box}-${index}`"
          :background="background"
          :color="box.color"
          :active="box.active"
          @click.native="selectColorBox(index)"
          @remove="removeColorBox(index)"
          class="Color-colorBox"
          :class="{
            '--isFaded': shouldFadeOut(box.active),
            '--isSelected': box.active
          }"
        />
      </transition-group>
    </div>
    <color-picker
      @input="colorChange($event)"
      class="Color-picker"
      ref="colorPicker"
    />
    <button class="Color-colorBoxAdd" @click="addColorBox">Add color</button>
  </div>
  <!-- </div> -->
</template>

<script>
import * as clipboard from 'clipboard-polyfill';

import { randomColor, needsDarkMode } from '@/utils';
import ColorPicker from '@/components/color-picker';
import ColorBox from '@/components/color-box';
import ColorspaceIcon from '@/components/icons/colorspace';
import ExternalIcon from '@/components/icons/external';
import ShareIcon from '@/components/icons/share';
import LettersIcon from '@/components/icons/letters-icon';

export default {
  name: 'Color',
  components: {
    ColorPicker,
    ColorBox,
    ColorspaceIcon,
    ExternalIcon,
    ShareIcon,
    LettersIcon
  },
  data() {
    return {
      colorBoxesMeta: [],
      activeColorBox: -1,
      isDark: false,
      shareLinkText: 'Share'
    };
  },
  computed: {
    hsluv: {
      get() {
        return this.$store.state.hsluv;
      },
      set(value) {
        this.$store.commit('setHSLuv', value);
      }
    },
    letters: {
      get() {
        return this.$store.state.letters;
      },
      set(value) {
        this.$store.commit('setLetters', value);
      }
    },
    background: {
      get() {
        return this.$store.state.background;
      },
      set(value) {
        this.$store.commit('setBackground', value);
      }
    },
    colorBoxes: {
      get() {
        return this.$store.state.colorBoxes;
      }
    }
  },
  mounted() {
    this.isDark = needsDarkMode(this.background);
    this.updateColorBoxMeta();
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
      this.$store.commit('addBox', newColor);
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
      this.$store.commit('removeBox', index);
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
      this.shareLinkText = 'Share';
      if (this.activeColorBox >= 0) {
        this.$store.commit('changeBox', {
          index: this.activeColorBox,
          hex: event.hex
        });
        this.updateColorBoxMeta();
      } else {
        this.$store.commit('setBackground', event.hex);
        this.isDark = needsDarkMode(event.hex);
      }
    },
    shouldFadeOut(activeState) {
      return this.activeColorBox !== -1 && !activeState;
    },
    copyShareLink() {
      const boxes = this.colorBoxes
        .map(color => color.replace(/#*/g, ''))
        .join(',');
      const params = `${this.background.replace(/#*/g, '')}/${boxes}`;
      const link = `${window.location.origin}/share/${params}`;
      clipboard.writeText(link);
      this.shareLinkText = 'Copied!';
    }
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

.Color {
  @include montserrat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: calc(100vh - 10vmin);
  padding: 5vmin;

  color: var(--color);

  &.--isDark {
    --color: #{$light};
    --inverted: #{$dark};
    --invalid: rgb(255, 45, 45);
  }

  &-top {
    width: 100%;
  }

  &-logo {
    width: 100%;
    margin: 0;
    margin-bottom: 1rem;

    font-size: 1.5rem;
    text-align: center;

    transition: color 0.5s ease-in-out;
  }

  &-options {
    @include space-mono();

    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    width: 100%;
    margin-bottom: 3vmin;

    text-align: center;

    cursor: pointer;
  }

  &-optionsGroup {
    display: flex;
    margin: {
      top: 0.5em;
      right: 2em;
      bottom: 0.5em;
      left: 0;
    }

    &:last-of-type {
      margin-right: 0;
    }
  }

  &-option {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 2em;

    &.--isInactive {
      text-decoration: line-through;

      opacity: 0.57;
    }

    &.--isDivider {
      opacity: 0.2;
    }

    &:last-of-type {
      margin-right: 0;
    }

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &-optionLabel {
    margin-left: 0.5em;
  }

  &-optionIcon {
    height: 1.25em;
  }

  &-changeMode {
    @include space-mono();
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  // &-content {
  //   flex: 1;

  //   text-align: center;
  // }

  &-picker {
    width: 100%;
    margin: 3vmin 0;
  }

  &-colorBoxes {
    width: 100%;
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
