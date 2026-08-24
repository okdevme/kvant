<script setup lang="ts">
import { number, string } from 'kvantjs/schema'
import { useCookies } from 'kvantjs/vue'

const value = useCookies('test', string())
const count = useCookies('count', number())
</script>

<template>
  <button id="set-pass" @click="value = 'pass'">
    Set
  </button>
  <button id="clear" @click="value = undefined">
    Clear
  </button>
  <button id="increment" @click="count = (count ?? 0) + 1">
    Increment
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
  <pre id="count">{{ count ?? '' }}</pre>
</template>
