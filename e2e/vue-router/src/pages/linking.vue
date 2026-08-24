<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useRouteQuery } from 'kvantjs/vue-router'

const value = useRouteQuery('test', string())
</script>

<template>
  <RouterLink to="/linking?test=link-value">
    <span id="link-with-query">with query</span>
  </RouterLink>
  <RouterLink to="/linking-target?test=cross">
    <span id="link-cross-page">cross page</span>
  </RouterLink>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
