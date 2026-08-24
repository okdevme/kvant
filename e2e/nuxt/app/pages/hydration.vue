<script setup lang="ts">
import { useCookies } from 'kvantjs/nuxt'
import { string } from 'kvantjs/schema'
import { useLocalStorage } from 'kvantjs/vue'

const value = useCookies('test', string())
const stored = useLocalStorage('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
  <pre id="stored">{{ stored ?? '' }}</pre>
</template>
