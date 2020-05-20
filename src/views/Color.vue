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
    <div class="Color-colorBoxes">
      <transition-group name="ColorBoxList" tag="div" appear>
        <color-box
          v-for="(box, index) in colorBoxesMeta"
          :key="`${box}-${index}`"
          :background="background"
          :color="box.color"
          :active="box.active"
          @click.native="toggleColorBox(index)"
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
      // Computed meta object for templating the boxes
      colorBoxesMeta: [],
      // The active box index, -1 is the background
      activeColorBox: -1,
      // Darkmode
      isDark: false,
      // Share link button text
      shareLinkText: 'Share'
    };
  },
  computed: {
    // Vuex
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
    // Calculate if the current view needs dark mode on render
    this.isDark = needsDarkMode(this.background);
    // Create the colorBoxMeta object
    this.updateColorBoxMeta();
    // Set the color pickers values to the current background
    this.$refs.colorPicker.setTo(this.background);
  },
  methods: {
    // Re-calculate the colorBoxMeta object
    updateColorBoxMeta() {
      this.colorBoxesMeta = this.colorBoxes.map((color, index) => {
        return {
          color,
          active: index === this.activeColorBox
        };
      });
    },
    // Create a new box
    addColorBox() {
      // Get a random color
      let newColor = randomColor(this.isDark);
      this.$store.commit('addBox', newColor);
      // After Vue renders the new box
      this.$nextTick(() => {
        this.updateColorBoxMeta();
        // Wait a litte (125ms), so that everything doesn't (visually) happen at once
        setTimeout(() => {
          this.activeColorBox = this.colorBoxes.length - 1;
          this.$refs.colorPicker.setTo(newColor);
        }, 125);
      });
    },
    // Remove a box from the app
    removeColorBox(index) {
      this.activeColorBox = -1;
      this.$refs.colorPicker.setTo(this.background);
      this.$store.commit('removeBox', index);
      this.$nextTick(() => {
        this.updateColorBoxMeta();
      });
    },
    // Toggle the selected box active state
    toggleColorBox(index) {
      // If active, deselect box
      if (this.activeColorBox === index) {
        document.removeEventListener('keydown', this.escapeBoxInput);
        // Make the background active
        this.activeColorBox = -1;
        this.$refs.colorPicker.setTo(this.background);
      } else {
        // Set the box to active
        this.activeColorBox = index;
        // Update state values to the now active box
        this.$refs.colorPicker.setTo(this.colorBoxes[index]);

        // Escape undoes input func
        this.oldColor = this.colorBoxes[index];
        document.addEventListener('keydown', this.escapeBoxInput);
      }
      // Finally update the colorBoxMeta object
      this.updateColorBoxMeta();
    },
    escapeBoxInput(event) {
      if (event.code !== 'Escape') return;
      // Commit the old value of the box to the store
      this.$store.commit('changeBox', {
        index: this.activeColorBox,
        hex: this.oldColor
      });
      this.oldColor = '';
      // Run toggleColorBox (it will always deselect the box as this function only runs when it's active)
      this.toggleColorBox(this.activeColorBox);
    },
    // When the color state is changed
    colorChange(event) {
      // Now that color state is changed, the share link is no longer valid, therefore revert back to default
      this.shareLinkText = 'Share';
      // The change is on a box
      if (this.activeColorBox >= 0) {
        this.$store.commit('changeBox', {
          index: this.activeColorBox,
          hex: event.hex
        });
        this.updateColorBoxMeta();
      } else {
        // The change is to the background
        this.$store.commit('setBackground', event.hex);
        this.isDark = needsDarkMode(event.hex);
      }
    },
    shouldFadeOut(activeState) {
      // Is a box selected, and is passed in box state active?
      return this.activeColorBox !== -1 && !activeState;
    },
    copyShareLink() {
      // Generate sharelink
      const boxes = this.colorBoxes
        .map(color => color.replace(/#*/g, ''))
        .join(',');
      const params = `${this.background.replace(/#*/g, '')}/${boxes}`;
      const link = `${window.location.origin}/share/${params}`;
      // Copy link to user's clipboard
      clipboard.writeText(link);
      // Update UI text to show that the action is complete
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

  // Darkmode color palette
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

// Vue transition classes
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
