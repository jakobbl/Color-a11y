<template>
  <div class="CrossGrid" :class="{ '--isDark': darkMode }">
    <div class="CrossGrid-top">
      <h1 class="CrossGrid-logo">Color a11y</h1>
      <div class="CrossGrid-options">
        <div class="CrossGrid-optionsGroup">
          <div
            class="CrossGrid-option"
            @click="letters = !letters"
            :class="{ '--isInactive': !letters }"
          >
            <letters-icon class="CrossGrid-optionIcon" />
            <span class="CrossGrid-optionLabel">Letters</span>
          </div>
          <div
            class="CrossGrid-option"
            @click="icons = !icons"
            :class="{ '--isInactive': !icons }"
          >
            <icon-icon class="CrossGrid-optionIcon" />
            <span class="CrossGrid-optionLabel">Icons</span>
          </div>
          <div
            class="CrossGrid-option"
            @click="darkMode = !darkMode"
            :class="{ '--isInactive': !darkMode }"
          >
            <darkmode-icon class="CrossGrid-optionIcon" />
            <span class="CrossGrid-optionLabel">Dark mode</span>
          </div>
        </div>
        <div class="CrossGrid-optionsGroup">
          <div class="CrossGrid-option">
            <external-icon class="CrossGrid-optionIcon" />
            <router-link
              to="/color"
              class="CrossGrid-optionLabel"
              target="_blank"
              >Color picker</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="CrossGrid-grid"
      :class="{
        '--isScrollableLeft': hasItemsToTheLeft,
        '--isScrollableRight': hasItemsToTheRight
      }"
    >
      <div
        class="CrossGrid-scroller"
        :style="{ '--cols': boxes.length }"
        ref="grid"
      >
        <div
          class="CrossGrid-gridBox"
          v-for="(box, index) in boxGrid"
          :key="`box-${index}-${box}`"
          :class="{ '--isBlank': box[0] == box[1] }"
        >
          <cross-box
            class="CrossGrid-crossBox"
            :back="box[0]"
            :front="box[1]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExternalIcon from '@/components/icons/external';
import LettersIcon from '@/components/icons/letters-icon';
import DarkmodeIcon from '@/components/icons/darkmode';
import IconIcon from '@/components/icons/icon';
import CrossBox from '@/components/cross-box';

export default {
  components: {
    ExternalIcon,
    LettersIcon,
    DarkmodeIcon,
    IconIcon,
    CrossBox
  },
  data() {
    return {
      darkMode: false,
      icon: '',
      hasItemsToTheLeft: false,
      hasItemsToTheRight: false,
      resizeObserver: undefined
    };
  },
  computed: {
    letters: {
      get() {
        return this.$store.state.letters;
      },
      set(value) {
        this.$store.commit('setLetters', value);
      }
    },
    icons: {
      get() {
        return this.$store.state.icons;
      },
      set(value) {
        this.icon = this.getRandomIcon();
        this.$store.commit('setIcons', value);
      }
    },
    boxes() {
      return this.$store.getters.allColors;
    },
    boxGrid() {
      let grid = [];
      for (let ir = 0; ir < this.boxes.length; ir += 1) {
        grid[ir] = [];
        for (let ic = 0; ic < this.boxes.length; ic += 1) {
          grid[ir][ic] = [this.boxes[ir], this.boxes[ic]];
        }
      }
      return grid.flat();
    }
  },
  methods: {
    getRandomIcon() {
      const icons = [
        'butterfly',
        'clock',
        'controller',
        'documents',
        'firetruck',
        'fountain',
        'iceSkating'
      ];
      return icons[Math.floor(Math.random() * icons.length)];
    },
    setScrollAffordance(event) {
      window.requestAnimationFrame(() => {
        const scrolled = event.target.scrollLeft;
        const offsetWidth = event.target.offsetWidth;
        const containerWidth = event.target.scrollWidth;

        if (scrolled >= containerWidth * 0.15) {
          this.hasItemsToTheLeft = true;
        }

        if (scrolled < containerWidth * 0.15) {
          this.hasItemsToTheLeft = false;
        }

        if (scrolled + offsetWidth < containerWidth * 0.85) {
          this.hasItemsToTheRight = true;
        }

        if (scrolled + offsetWidth >= containerWidth * 0.85) {
          this.hasItemsToTheRight = false;
        }
      });
    }
  },
  mounted() {
    this.icon = this.getRandomIcon();
    this.$refs.grid.addEventListener('scroll', this.setScrollAffordance);
    this.resizeObserver = new ResizeObserver(() => {
      this.setScrollAffordance({ target: this.$refs.grid });
    });
    this.resizeObserver.observe(this.$refs.grid);
  },
  beforeDestroy() {
    this.$refs.grid.removeEventListener('scroll', this.setScrollAffordance);
    this.resizeObserver.unobserve(this.$refs.grid);
  }
};
</script>

<style lang="scss">
@import '@/scss/global';

.CrossGrid {
  @include montserrat;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 10vmin);
  padding: 5vmin;

  color: var(--color);

  background-color: var(--inverted);

  transition: background-color 0.5s;

  &.--isDark {
    --color: #{$light};
    --inverted: #{$dark};
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
      margin-left: 2em;

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

  &-grid {
    position: relative;

    flex: 1;
    width: calc(100% - (2 * 2rem));
    margin: 0 auto;
    padding: 0 2rem;

    &::before,
    &::after {
      position: fixed;
      top: 55%;
      z-index: 999;

      width: 0.25em;
      height: 40vh;

      background: currentColor;

      transform: translateY(-50%) scaleY(0);

      opacity: 0.85;

      transition: transform 0.25s;

      content: '';

      @media (max-width: 800px) {
        display: none;
      }
    }

    &::before {
      left: 1.5em;
    }

    &.--isScrollableLeft::before {
      transform: translateY(-50%) scaleY(1);
    }

    &::after {
      right: 1.5em;
    }

    &.--isScrollableRight::after {
      transform: translateY(-50%) scaleY(1);
    }
  }

  &-scroller {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: repeat(var(--cols), minmax(200px, 400px));
    overflow: auto;

    @media (max-width: 800px) {
      flex: unset;
      grid-gap: 1em;
      grid-template-columns: repeat(2, 1fr);
      width: 100%;
    }
  }

  &-gridBox {
    position: relative;

    &::before {
      display: block;
      width: 100%;
      padding-top: (1 / 1) * 100%;

      content: '';
    }

    &.--isBlank {
      @media (max-width: 800px) {
        display: none;
      }
    }
  }

  &-crossBox {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }
}
</style>
