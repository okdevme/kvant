<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useRouteQuery } from 'kvantjs/vue-router'

const value = useRouteQuery('test', string(), { history: 'push' })
</script>

<template>
  <button id="set-pass" @click="value = 'pass'">
    Set
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
