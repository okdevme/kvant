<script setup lang="ts">
import { string } from 'kvant/schema'
import { useSearchParams } from 'kvant/vue'

const a = useSearchParams('test', string())
const states = useSearchParams({ test: string() })
</script>

<template>
  <button id="set-a" @click="a = 'from-a'">
    Set A
  </button>
  <button id="set-b" @click="states = { test: 'from-b' }">
    Set B
  </button>
  <pre id="state-a">{{ a ?? '' }}</pre>
  <pre id="state-b">{{ states.test ?? '' }}</pre>
</template>
