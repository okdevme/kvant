<script setup lang="ts">
import { number, string } from 'kvant/schema'
import { useRouteParams } from 'kvant/vue-router'

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
