<script setup lang="ts">
import { string } from 'kvant/schema'
import { useSearchParams } from 'kvant/vue'

const value = useSearchParams('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
