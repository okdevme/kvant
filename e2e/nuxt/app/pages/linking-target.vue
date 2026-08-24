<script setup lang="ts">
import { useRouteQuery } from 'kvantjs/nuxt'
import { string } from 'kvantjs/schema'

const value = useRouteQuery('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
