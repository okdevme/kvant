<script setup lang="ts">
import { ref } from 'vue'
import Inner from './conditionalRenderingInner.vue'

const mounted = ref(true)
</script>

<template>
  <button id="toggle" @click="mounted = !mounted">
    Toggle
  </button>
  <Inner v-if="mounted" />
  <pre v-else id="state">unmounted</pre>
</template>
