<script setup lang="ts">
const mounted = ref(true)
</script>

<template>
  <button id="toggle" @click="mounted = !mounted">
    Toggle
  </button>
  <ConditionalInner v-if="mounted" />
  <pre v-else id="state">unmounted</pre>
</template>
