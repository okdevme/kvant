<script setup lang="ts">
import { string } from 'kvant/schema'
import { useRouteQuery } from 'kvant/vue-router'
import { useRouter } from 'vue-router'

const value = useRouteQuery('test', string())
const router = useRouter()

const target = '/linking-target?test=routed'
</script>

<template>
  <button id="nav-push" @click="router.push(target)">
    Push
  </button>
  <button id="nav-replace" @click="router.replace(target)">
    Replace
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
