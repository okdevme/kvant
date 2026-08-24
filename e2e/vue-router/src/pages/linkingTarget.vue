<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useRouteQuery } from 'kvantjs/vue-router'

const value = useRouteQuery('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
