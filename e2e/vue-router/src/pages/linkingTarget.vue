<script setup lang="ts">
import { string } from 'kvant/schema'
import { useRouteQuery } from 'kvant/vue-router'

const value = useRouteQuery('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
