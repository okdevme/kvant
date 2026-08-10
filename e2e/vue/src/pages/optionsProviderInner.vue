<script setup lang="ts">
import { string } from 'kvant/schema'
import { useSearchParams } from 'kvant/vue'

// inherits history: 'push' from provideSearchParamsOptions in the parent
const value = useSearchParams('test', string())
// per-hook override wins
const override = useSearchParams('override', string(), { history: 'replace' })
</script>

<template>
  <button id="set-pass" @click="value = 'pass'">
    Set
  </button>
  <button id="set-override" @click="override = 'yes'">
    Set override
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
  <pre id="override">{{ override ?? '' }}</pre>
</template>
