<script setup lang="ts">
import { useSearchParamsKvantAdapter } from 'kvantjs'
import * as kv from 'kvantjs/schema'
import { defineKvantState } from 'kvantjs/vue'
import qs from 'qs'

// Setup copied from docs (_custom-search-serializer.mdx).
const { useState: useSearchParams } = defineKvantState(
  (keys, options) => useSearchParamsKvantAdapter(keys, {
    parseSearch: search => qs.parse(search, { ignoreQueryPrefix: true }),
    stringifySearch: values => qs.stringify(values, { encodeValuesOnly: true }),
    ...options,
  }),
)

const filtersSchema = kv.object({
  tags: kv.string().array().default([]),
  range: kv.tuple([kv.number(), kv.number()]).optional(),
}).default({ tags: [] })

const filters = useSearchParams('filters', filtersSchema)
</script>

<template>
  <button
    id="set-filters"
    @click="filters = { tags: ['a', 'b'], range: [1, 9] }"
  >
    Set filters
  </button>
  <pre id="state">{{ JSON.stringify(filters) }}</pre>
</template>
