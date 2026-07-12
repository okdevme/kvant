# kvant

## Schema

Kvant schemas are not _validation_ schemas, like Zod, but are _**coercion**_ schemas —
they are designed to not throw errors when given inappropriate data, but to make the most out of it.

```ts
import * as kvant from 'kvant/schema'

const schema = kvant.string().default('defaultValue')
const schema = kvant.number()
const schema = kvant.object({
  key1: kvant.string().default('defaultValue', { clearOnDefault: false }),
  key2: kvant.number(),
  // ...
})

/**
 * Should mirror the zod schema methods for kvant to be compatible with zod codecs
 */
schema.parse({}) // transform from raw data
schema.encode({}) // transform to raw data
```

```ts
kvant.default(schema, () => 'defaultValue')
kvant.prefault(schema, () => 'defaultValue')
kvant.nullable(schema)
/**
 * Schemas chaining
 *
 * Executes the schemas from left to right in parse, from right to left in encode
 *
 * Must check type compatibility:
 * - between Output of schema1 and RawInput of schema2
 * - between Input of schema2 and Output of schema1
 */
kvant.pipe(schema1, schema2)
/**
 * Transform the value without changing the type
 *
 * Cannot change the type as it needs to be bidirectional, transform() should be used for changing the type instead
 */
kvant.overwrite(schema, (value) => {})
/**
 * Transform the value and change the type
 *
 * Essentially a custom schema, but with a RawInput type equal to Input type, meant to be used inside pipe()
 */
kvant.transform<Input, Output>({
  parse: (value: Input) => Output,
  encode: (value: Output) => Input,
})
/**
 * Custom schema
 */
kvant.custom<Output, Input>({
  parse: (value: unknown) => Output,
  encode: (value: Output) => Input,
})
```

Documentation for schemas like `nullable` and `object` should note that not all adapters support them
and the data can become inconsistent between reads/writes if they are used in combination with such adapters.

## Vanilla

### Local Storage

```ts
import { useLocalStorage } from 'kvant/storage'

const { subscribe, getSnapshot, update, dispose } = useLocalStorage('key', {})
const { subscribe, getSnapshot, update, dispose } = useLocalStorage('key', schema, {})
const { subscribe, getSnapshot, update, dispose } = useLocalStorage({ key1: schema, key2: schema }, {})
```

#### Manual Setup

via `defineKvant` helper:
```ts
import { createKvant } from 'kvant'
import { useLocalStorageKvantAdapter, useStorageKvantAdapter } from 'kvant/storage'

const useLocalStorage = defineKvant(() => useStorageKvantAdapter(localStorage), {})
const useLocalStorage = defineKvant(useLocalStorageKvantAdapter, {})
```

or directly:
```ts
import { useKvantState } from 'kvant'
import { useLocalStorageKvantAdapter } from 'kvant/storage'

const { subscribe, getSnapshot, update, dispose } = useKvantState(useLocalStorageKvantAdapter, 'key', {})
const { subscribe, getSnapshot, update, dispose } = useKvantState(useLocalStorageKvantAdapter, 'key', schema, {})
const { subscribe, getSnapshot, update, dispose } = useKvantState(useLocalStorageKvantAdapter, { key1: schema, key2: schema }, {})
```

## React

### React Router

```ts
import { useParams, useSearchParams } from 'kvant/react/react-router'

const [value, setValue] = useSearchParams('key', schema, { mode: 'replace' })
setValue('value', { mode: 'replace' })
setValue(current => 'value', { mode: 'replace' })

const [values, setValues] = useSearchParams({ key1: schema, key2: schema }, { mode: 'replace' })
setValues({ key1: 'value1', key2: 'value2' }, { mode: 'replace' })
setValues(current => ({ key1: 'value1', key2: 'value2' }), { mode: 'replace' })
```

#### Manual Setup

via `defineKvant` helper:
```ts
import { defineKvant } from 'kvant/react'
import { useParamsKvantAdapter, useSearchParamsKvantAdapter } from 'kvant/react/react-router'

const useSearchParams = defineKvant(useSearchParamsKvantAdapter, { mode: 'replace' })
```

or directly:
```ts
import { useKvantState } from 'kvant/react'
import { useLocalStorageKvantAdapter } from 'kvant/storage'

const [values, setValues] = useKvantState(useLocalStorageKvantAdapter, 'key', {})
const [values, setValues] = useKvantState(useLocalStorageKvantAdapter, 'key', schema, {})
const [values, setValues] = useKvantState(useLocalStorageKvantAdapter, { key1: schema, key2: schema }, {})
```

### Local Storage

```ts
import { useLocalStorage } from 'kvant/react/storage'

const [value, setValue] = useLocalStorage('key', schema)
const [values, setValues] = useLocalStorage({ key1: schema, key2: schema })
```

#### Manual Setup

via `defineKvant` helper:
```ts
import { defineKvant } from 'kvant/react'
import { useLocalStorageKvantAdapter, useStorageKvantAdapter } from 'kvant/storage'

const useLocalStorage = defineKvant(() => useStorageKvantAdapter(localStorage), {})
const useLocalStorage = defineKvant(useLocalStorageKvantAdapter, {})
```

or directly:
```ts
import { useKvantState } from 'kvant/react'
import { useLocalStorageKvantAdapter } from 'kvant/storage'

const [values, setValues] = useKvantState(useLocalStorageKvantAdapter, 'key', {})
const [values, setValues] = useKvantState(useLocalStorageKvantAdapter, 'key', schema, {})
const [values, setValues] = useKvantState(useLocalStorageKvantAdapter, { key1: schema, key2: schema }, {})
```

/**
* Vue
*
* `useData` should leverage native Vue reactivity around `parse()` and `simplify()` schema methods
  */
  // Inline
  const adapter = useRouteQueryDataAdapter() // wraps useRoute().query
  const data = useData(adapter, schema)
  // or
  const data = useRouteQueryData(schema) // useRouteQueryDataAdapter + useData

// Global
const adapter = new StorageKvantAdapter()
const data = schema.construct(adapter)
// Usage
const data = useData(data)
