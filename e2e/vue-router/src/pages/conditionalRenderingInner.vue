<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useRouteQuery } from 'kvantjs/vue-router'

const value = useRouteQuery('test', string())
</script>

<template>
  <button id="inner-set" @click="value = 'inner'">
    Inner set
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
