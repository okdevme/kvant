<script setup lang="ts">
import { useRouteQuery } from 'kvantjs/nuxt'
import { string } from 'kvantjs/schema'

const value = useRouteQuery('test', string())
</script>

<template>
  <button id="inner-set" @click="value = 'inner'">
    Inner set
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
