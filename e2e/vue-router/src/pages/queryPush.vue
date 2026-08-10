<script setup lang="ts">
import { string } from 'kvant/schema'
import { useRouteQuery } from 'kvant/vue-router'

const value = useRouteQuery('test', string(), { history: 'push' })
</script>

<template>
  <button id="set-pass" @click="value = 'pass'">
    Set
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
