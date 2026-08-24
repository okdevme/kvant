<script setup lang="ts">
import { number, string } from 'kvantjs/schema'
import { useSearchParams } from 'kvantjs/vue'

const value = useSearchParams('test', string())
const count = useSearchParams('count', number())
const multi = useSearchParams({ a: string(), b: number() })
</script>

<template>
  <button id="set-pass" @click="value = 'pass'">
    Set
  </button>
  <button id="clear" @click="value = undefined">
    Clear
  </button>
  <button id="increment" @click="count = (count ?? 0) + 1">
    Increment
  </button>
  <button id="set-multi" @click="multi = { a: 'x', b: 2 }">
    Set multi
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
  <pre id="count">{{ count ?? '' }}</pre>
  <pre id="multi">{{ JSON.stringify(multi) }}</pre>
</template>
