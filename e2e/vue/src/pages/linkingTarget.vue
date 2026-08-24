<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useSearchParams } from 'kvantjs/vue'

const value = useSearchParams('test', string())
</script>

<template>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
