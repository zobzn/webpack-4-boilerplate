<template>
  <div>
    <div :class="$style.header">Vue works</div>
    <div :class="styles.counter">{{ i }}</div>
  </div>
</template>

<script>
import styles from "./App.module.scss";

export default {
  data() {
    return {
      interval: null,
      styles,
      i: 0
    };
  },
  mounted() {
    this.interval = setInterval(this.increment, 100);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    increment() {
      this.i += 1;
    }
  }
};
</script>

<!--
this will be available as this.$style
-->
<style lang="scss" module>
$color: inherit;

.header {
  color: $color;
}
</style>

<!--
this will be available as this.styles
<style lang="scss" module="styles">
$green: green;

.header {
  color: $green;
}
</style>
-->
