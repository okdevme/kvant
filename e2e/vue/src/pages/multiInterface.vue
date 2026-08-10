<script setup lang="ts">
import { string } from 'kvant/schema'
import { useCookies, useLocalStorage, useSearchParams } from 'kvant/vue'

const query = useSearchParams('test', string())
const cookie = useCookies('test', string())
const stored = useLocalStorage('test', string())

function setAll() {
  query.value = 'q'
  cookie.value = 'c'
  stored.value = 's'
}
</script>

<template>
  <button id="set-query" @click="query = 'from-query'">
    Set query
  </button>
  <button id="set-cookie" @click="cookie = 'from-cookie'">
    Set cookie
  </button>
  <button id="set-storage" @click="stored = 'from-storage'">
    Set storage
  </button>
  <button id="set-all" @click="setAll">
    Set all
  </button>
  <pre id="query">{{ query ?? '' }}</pre>
  <pre id="cookie">{{ cookie ?? '' }}</pre>
  <pre id="storage">{{ stored ?? '' }}</pre>
</template>
