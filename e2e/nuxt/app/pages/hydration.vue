<script setup lang="ts">
import { useCookies } from 'kvant/nuxt'
import { string } from 'kvant/schema'
import { useLocalStorage } from 'kvant/vue'

const value = useCookies('test', string())
const stored = useLocalStorage('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
  <pre id="stored">{{ stored ?? '' }}</pre>
</template>
