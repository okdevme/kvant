<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useSearchParams } from 'kvantjs/vue'

const value = useSearchParams('test', string())
</script>

<template>
  <button id="inner-set" @click="value = 'inner'">
    Inner set
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
