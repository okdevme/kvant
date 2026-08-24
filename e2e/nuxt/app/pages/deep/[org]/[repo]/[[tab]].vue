<script setup lang="ts">
import { useRouteParams, useRouteQuery } from 'kvantjs/nuxt'
import { string } from 'kvantjs/schema'

const org = useRouteParams('org', string())
const repo = useRouteParams('repo', string())
const tab = useRouteParams('tab', string())
const q = useRouteQuery('q', string())
</script>

<template>
  <button id="set-repo" @click="repo = 'next'">
    Set repo
  </button>
  <button id="set-tab" @click="tab = 'issues'">
    Set tab
  </button>
  <button id="set-q" @click="q = 'filter'">
    Set q
  </button>
  <pre id="org">{{ org ?? '' }}</pre>
  <pre id="repo">{{ repo ?? '' }}</pre>
  <pre id="tab">{{ tab ?? '' }}</pre>
  <pre id="q">{{ q ?? '' }}</pre>
</template>
