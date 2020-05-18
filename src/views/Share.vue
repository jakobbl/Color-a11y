<template v-if="error">
  <div class="Share">
    <div class="Share-top">
      <h1 class="Share-logo">Color a11y</h1>
    </div>
    <div class="Share-content">
      <div v-if="error">
        <h1>Invalid share link</h1>
        <router-link to="/">Go home</router-link>
      </div>
      <div v-else>
        <h1>Setting up</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { isValidHex } from '@/utils';

export default {
  data() {
    return {
      // Error state for templating
      error: false
    };
  },
  mounted() {
    // Share url pattern is .../share/background/box1,box2,box3,box4
    // Color must be prefixed within Vue data, but NOT in the URL
    const bg = '#' + this.$route.params.background;
    let colors = this.$route.params.colors.split(',').map(color => '#' + color);

    /* Check for valid background hex value
       OR if no colors was in the URL */
    if (!isValidHex(bg) || colors.length == 0) {
      // If not set error state and return
      this.error = true;
      return;
    }

    // Check that every value provided in boxes is a valid hexcode
    if (!colors.every(color => isValidHex(color))) {
      this.error = true;
      return;
    }

    // All validation checks passed, commit data to store, and navigate to front page
    this.$store.commit('setBackground', bg);
    this.$store.commit('overrideBoxesTo', colors);
    this.$router.push('/');
  }
};
</script>

<style scoped lang="scss">
@import '@/scss/global';

.Share {
  @include montserrat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: calc(100vh - 10vmin);
  padding: 5vmin;

  background-color: var(--invalid);

  &-top {
    width: 100%;
  }

  &-logo {
    width: 100%;
    margin: 0;
    margin-bottom: 1rem;

    font-size: 1.5rem;
    text-align: center;
  }

  &-content {
    display: flex;
    flex: 1;
    align-items: center;

    margin-bottom: 5%;

    color: var(--inverted);
    font-size: 150%;
    text-align: center;
  }

  a {
    color: var(--color);
  }
}
</style>
