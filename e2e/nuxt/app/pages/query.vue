<script setup lang="ts">
import { useRouteQuery } from 'kvant/nuxt'
import { number, string } from 'kvant/schema'

const value = useRouteQuery('test', string())
const count = useRouteQuery('count', number())
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
