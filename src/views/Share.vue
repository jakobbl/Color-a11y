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
      error: false
    };
  },
  mounted() {
    const bg = '#' + this.$route.params.background;
    let colors = this.$route.params.colors.split(',').map(color => '#' + color);

    // Check for valid hexes
    if (!isValidHex(bg) || colors.length == 0) {
      this.error = true;
      return;
    }

    if (!colors.every(color => isValidHex(color))) {
      this.error = true;
      return;
    }

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
