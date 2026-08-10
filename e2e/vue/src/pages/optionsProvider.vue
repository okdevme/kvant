<script setup lang="ts">
import { provideSearchParamsOptions } from 'kvant/vue'
import Inner from './optionsProviderInner.vue'

provideSearchParamsOptions({ history: 'push' })
</script>

<template>
  <Inner />
</template>
