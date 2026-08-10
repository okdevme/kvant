<script setup lang="ts">
import { string } from 'kvant/schema'
import { useCookies } from 'kvant/vue'

const value = useCookies('test', string())
const expiring = useCookies('expiring', string(), { maxAge: 3600 })
const scoped = useCookies('scoped', string(), { path: '/cookie-attributes' })
</script>

<template>
  <button id="set-pass" @click="value = 'pass'">
    Set
  </button>
  <button id="set-expiring" @click="expiring = 'alive'">
    Set expiring
  </button>
  <button id="set-scoped" @click="scoped = 'scoped-value'">
    Set scoped
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
  <pre id="expiring">{{ expiring ?? '' }}</pre>
  <pre id="scoped">{{ scoped ?? '' }}</pre>
</template>
