<script setup lang="ts">
import { useRouteParams } from 'kvantjs/nuxt'
import { number, string } from 'kvantjs/schema'

const id = useRouteParams('id', string())
const tab = useRouteParams('tab', number())
</script>

<template>
  <button id="set-id" @click="id = 'abc'">
    Set id
  </button>
  <button id="set-tab" @click="tab = 2">
    Set tab
  </button>
  <pre id="id">{{ id ?? '' }}</pre>
  <pre id="tab">{{ tab ?? '' }}</pre>
</template>
