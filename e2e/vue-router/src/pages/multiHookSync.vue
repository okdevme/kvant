<script setup lang="ts">
import { string } from 'kvant/schema'
import { useRouteQuery } from 'kvant/vue-router'

const a = useRouteQuery('test', string())
const states = useRouteQuery({ test: string() })
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
