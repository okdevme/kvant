<script setup lang="ts">
import { useRouteQuery } from 'kvant/nuxt'
import { string } from 'kvant/schema'

const value = useRouteQuery('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
