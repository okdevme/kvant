import { useSearchParamsKvantAdapter } from 'kvant'
import { defineKvantState } from 'kvant/react'
import * as kv from 'kvant/schema'
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

export function CustomSerializerPage() {
  const [filters, setFilters] = useSearchParams('filters', filtersSchema)

  return (
    <>
      <button
        id="set-filters"
        onClick={() => setFilters({ tags: ['a', 'b'], range: [1, 9] })}
      >
        Set filters
      </button>
      <pre id="state">{JSON.stringify(filters)}</pre>
    </>
  )
}
