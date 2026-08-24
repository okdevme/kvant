<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useSearchParams } from 'kvantjs/vue'

const value = useSearchParams('test', string())
const scrollValue = useSearchParams('test', string(), { scroll: true })
</script>

<template>
  <div style="height: 3000px">
    Tall filler
  </div>
  <button id="write-default" @click="value = 'default'">
    Write default
  </button>
  <button id="write-scroll" @click="scrollValue = 'scroll'">
    Write scroll
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
