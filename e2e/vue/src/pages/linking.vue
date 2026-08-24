<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useSearchParams } from 'kvantjs/vue'
import { navigate } from '../router'

const value = useSearchParams('test', string())
</script>

<template>
  <a href="/linking?test=link-value" @click.prevent="navigate('/linking?test=link-value')">
    <span id="link-with-query">with query</span>
  </a>
  <a href="/linking-target?test=cross" @click.prevent="navigate('/linking-target?test=cross')">
    <span id="link-cross-page">cross page</span>
  </a>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
