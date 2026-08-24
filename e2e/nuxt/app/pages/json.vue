<script setup lang="ts">
import { useRouteQuery } from 'kvantjs/nuxt'
import { any, json } from 'kvantjs/schema'

const value = useRouteQuery('test', json(any()))
</script>

<template>
  <button id="set-json" @click="value = { a: 1, b: [true, 'x'] }">
    Set json
  </button>
  <pre id="state">{{ value === undefined ? '' : JSON.stringify(value) }}</pre>
</template>
