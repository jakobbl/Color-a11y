<template>
  <div class="CrossGrid"></div>
</template>

<script>
export default {
  computed: {
    background: {
      get() {
        return this.$store.state.background;
      }
    },
    colorBoxes: {
      get() {
        return this.$store.state.colorBoxes;
      }
    }
  }
};
</script>

<style></style>
