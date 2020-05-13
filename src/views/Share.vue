<template v-if="error">
  <div>
    <div v-if="error">
      <h1>Invalid share link</h1>
      <router-link to="/">Go home</router-link>
    </div>
    <div v-else>
      <h1>Setting up</h1>
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

div {
  @include montserrat();
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

h1 {
  width: 100%;

  text-align: center;
}
</style>
