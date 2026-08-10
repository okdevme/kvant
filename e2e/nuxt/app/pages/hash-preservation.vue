<script setup lang="ts">
import { useRouteQuery } from 'kvant/nuxt'
import { string } from 'kvant/schema'

const value = useRouteQuery('test', string())
</script>

<template>
  <button id="set-pass" @click="value = 'pass'">
    Set
  </button>
  <button id="clear" @click="value = undefined">
    Clear
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
