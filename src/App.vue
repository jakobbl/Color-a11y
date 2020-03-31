<template>
  <div id="app">
    <color-picker @input="colorChange($event)" />
    <color-box :background="background" :foreground="foreground" />
  </div>
</template>

<script>
import ColorPicker from "./components/color-picker";
import ColorBox from "./components/color-box";

export default {
  name: "App",
  components: {
    ColorPicker,
    ColorBox
  },
  data() {
    return {
      background: "#ff00cc",
      foreground: "#000"
    };
  },
  methods: {
    colorChange(event) {
      this.foreground = event;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
