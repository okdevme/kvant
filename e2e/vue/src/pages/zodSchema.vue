<script setup lang="ts">
import { useSearchParams } from 'kvantjs/vue'
import * as z from 'zod'

// Doc pattern (_zod.mdx): total schema via .catch().
const pageSchema = z.coerce.number().min(1).catch(1)

const value = useSearchParams('test', pageSchema)
</script>

<template>
  <button id="set-valid" @click="value = 42">
    Set valid
  </button>
  <button id="set-invalid" @click="value = 0">
    Set invalid
  </button>
  <pre id="state">{{ String(value) }}</pre>
</template>
