<script setup lang="ts">
import { provideSearchParamsOptions } from 'kvantjs/vue'
import Inner from './optionsProviderInner.vue'

provideSearchParamsOptions({ history: 'push' })
</script>

<template>
  <Inner />
</template>
