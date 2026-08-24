<script setup lang="ts">
import { string } from 'kvantjs/schema'
import { useRouteQuery } from 'kvantjs/vue-router'

const SPECIAL = 'a b+c/d?e&f=g'

const value = useRouteQuery('test', string())
</script>

<template>
  <button id="set-special" @click="value = SPECIAL">
    Set special
  </button>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
