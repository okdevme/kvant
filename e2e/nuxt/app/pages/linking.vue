<script setup lang="ts">
import { useRouteQuery } from 'kvantjs/nuxt'
import { string } from 'kvantjs/schema'

const value = useRouteQuery('test', string())
</script>

<template>
  <NuxtLink to="/linking?test=link-value">
    <span id="link-with-query">with query</span>
  </NuxtLink>
  <NuxtLink to="/linking-target?test=cross">
    <span id="link-cross-page">cross page</span>
  </NuxtLink>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
