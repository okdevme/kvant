<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useSearchParams } from 'kvantjs/vue'
import { navigate, replace } from '../router'

const value = useSearchParams('test', string())

const target = '/linking-target?test=routed'
</script>

<template>
  <button id="nav-push" @click="navigate(target)">
    Push
  </button>
  <button id="nav-replace" @click="replace(target)">
    Replace
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
