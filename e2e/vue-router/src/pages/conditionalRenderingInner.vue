<script setup lang="ts">
import { string } from 'kvant/schema'
import { useRouteQuery } from 'kvant/vue-router'

const value = useRouteQuery('test', string())
</script>

<template>
  <button id="inner-set" @click="value = 'inner'">
    Inner set
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
