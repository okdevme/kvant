<script setup lang="ts">
import { string } from 'kvant/schema'
import { useRouteQuery } from 'kvant/vue-router'

const value = useRouteQuery('test', string())

function onSubmit(event: Event) {
  event.preventDefault()
  const data = new FormData(event.currentTarget as HTMLFormElement)
  value.value = String(data.get('test') ?? '')
}
</script>

<template>
  <form id="form" @submit="onSubmit">
    <input id="input" name="test" :value="value ?? ''">
    <button id="submit" type="submit">
      Submit
    </button>
  </form>
  <pre id="state">{{ value ?? '' }}</pre>
</template>
