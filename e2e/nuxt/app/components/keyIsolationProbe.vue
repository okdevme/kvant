<script setup lang="ts">
import { useRouteQuery } from 'kvant/nuxt'
import { string } from 'kvant/schema'

const props = defineProps<{ id: string }>()
const state = useRouteQuery(props.id, string())

// Render instrumentation for e2e render-count assertions
// eslint-disable-next-line no-console -- intentional render instrumentation
const logRender = () => console.log(`render ${props.id}`)
onMounted(logRender)
onUpdated(logRender)
</script>

<template>
  <button :id="`trigger-${id}`" @click="state = 'pass'">
    Trigger {{ id }}
  </button>
  <pre :id="`state-${id}`">{{ state ?? '' }}</pre>
</template>
