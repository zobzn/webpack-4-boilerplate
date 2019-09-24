<template>
  <div>
    <div>Vue works</div>
    <div>{{ i }} ;)</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      i: 0
    };
  },
  mounted() {
    this.i = 0;

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
