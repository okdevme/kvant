<script setup lang="ts">
import { useRouteQuery } from 'kvant/nuxt'
import { string } from 'kvant/schema'

const value = useRouteQuery('test', string())

const target = '/linking-target?test=routed'
</script>

<template>
  <button id="nav-push" @click="navigateTo(target)">
    Push
  </button>
  <button id="nav-replace" @click="navigateTo(target, { replace: true })">
    Replace
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
