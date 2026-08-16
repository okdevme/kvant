<script setup lang="ts">
import { useCookies } from 'kvant/nuxt'
import { string } from 'kvant/schema'

const value = useCookies('test', string())
const expiring = useCookies('expiring', string(), { maxAge: 3600 })
const scoped = useCookies('scoped', string(), { path: '/cookie-attributes' })
const samesite = useCookies('samesite', string(), { sameSite: 'strict' })
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
  <button id="set-samesite" @click="samesite = 'strict-value'">
    Set samesite
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
  <pre id="expiring">{{ expiring ?? '' }}</pre>
  <pre id="scoped">{{ scoped ?? '' }}</pre>
  <pre id="samesite">{{ samesite ?? '' }}</pre>
</template>
