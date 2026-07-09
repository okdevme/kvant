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

## Adapters
```ts
// const adapter = new URLSearchParamsKvantAdapter()
// const adapter = new QsKvantAdapter()
const adapter = new StorageKvantAdapter(localStorage)
const adapter = new LocalStorageKvantAdapter()
const adapter = new SessionStorageKvantAdapter()
adapter.get('key')
adapter.set('key', {}, /* adapter-specific options: */{ mode: 'replace' })
adapter.watch((key, value, oldValue) => {})
adapter.dispose()
```

## Vanilla

**[HEADS UP]** Perhaps schema should be optional in all kvant utilities
and if not provided return raw data received from adapter via `adapter.get()`,
which possibly can have some better typing than `unknown` (also applies to frameworks).

### Local Storage

```ts
// lazy kvant (createLazyKvant), sets up the adapter only when any of the methods are called
import {
  createLocalStorageState,
  disposeLocalStorageAdapter, // disposing the automatically created adapter if needed
  getLocalStorage,
  setLocalStorage,
  watchLocalStorage,
} from 'kvant/adapters/storage'

getLocalStorage('key', schema)
setLocalStorage('key', schema, 'value', {})
setLocalStorage('key', schema, current => 'value', {})
watchLocalStorage('key', schema, (key, value, oldValue) => {})
const { get, set, watch } = createLocalStorageState('key', schema)

getLocalStorage({ key1: schema, key2: schema })
setLocalStorage({ key1: schema, key2: schema }, 'value', {})
setLocalStorage({ key1: schema, key2: schema }, current => 'value', {})
watchLocalStorage({ key1: schema, key2: schema }, (key, value, oldValue) => {})
const { get, set, watch } = createLocalStorageState({ key1: schema, key2: schema })
```

#### Manual Setup

##### Global

```ts
import { StorageKvantAdapter } from 'kvant/adapters/storage'

const adapter = new StorageKvantAdapter(localStorage)
```

##### Usage

via `createKvant` helper:
```ts
import { createKvant } from 'kvant'

const {
  getState: getLocalStorage,
  setState: setLocalStorage,
  watchState: watchLocalStorage,
  createState: createLocalStorageState,
} = createKvant(adapter)

getLocalStorage('key', schema)
setLocalStorage('key', schema, 'value', {})
setLocalStorage('key', schema, current => 'value', {})
watchLocalStorage('key', schema, (key, value, oldValue) => {})
const { get, set, watch } = createLocalStorageState('key', schema)

getLocalStorage({ key1: schema, key2: schema })
setLocalStorage({ key1: schema, key2: schema }, 'value', {})
setLocalStorage({ key1: schema, key2: schema }, current => 'value', {})
watchLocalStorage({ key1: schema, key2: schema }, (key, value, oldValue) => {})
const { get, set, watch } = createLocalStorageState({ key1: schema, key2: schema })
```

or directly:
```ts
import { createKvantState, getKvantState, setKvantState, watchKvantState } from 'kvant'

getKvantState(adapter, 'key', schema)
setKvantState(adapter, 'key', schema, 'value', {})
setKvantState(adapter, 'key', schema, current => 'value', {})
watchKvantState(adapter, 'key', schema, (key, value, oldValue) => {})
const { get, set, watch } = createKvantState(adapter, 'key', schema)

getKvantState(adapter, { key1: schema, key2: schema })
setKvantState(adapter, { key1: schema, key2: schema }, 'value', {})
setKvantState(adapter, { key1: schema, key2: schema }, current => 'value', {})
watchKvantState(adapter, { key1: schema, key2: schema }, (key, value, oldValue) => {})
const { get, set, watch } = createKvantState(adapter, { key1: schema, key2: schema })
```

## React

### React Router

#### In root component

```tsx
import { ParamsProvider, SearchParamsProvider } from 'kvant/react/adapters/react-router'

(
  <SearchParamsProvider options={{ mode: 'replace', processUrlSearchParams: () => {} }}>
    {children}
  </SearchParamsProvider>
)
```

#### Usage

```ts
import { ParamsAdapterContext, SearchParamsAdapterContext, useParams, useSearchParams } from 'kvant/react/adapters/react-router'

const [value, setValue] = useSearchParams('key', schema, { mode: 'replace' })
setValue('value', { mode: 'replace' })
setValue(current => 'value', { mode: 'replace' })

const [values, setValues] = useSearchParams({ key1: schema, key2: schema }, { mode: 'replace' })
setValues({ key1: 'value1', key2: 'value2' }, { mode: 'replace' })
setValues(current => ({ key1: 'value1', key2: 'value2' }), { mode: 'replace' })

const adapter = use(SearchParamsAdapterContext)
```

#### Manual Setup

```ts
import { createKvant } from 'kvant/react'
import { useParamsKvantAdapter, useSearchParamsKvantAdapter } from 'kvant/react/adapters/react-router'

const {
  Provider: SearchParamsProvider,
  useState: useSearchParams,
  AdapterContext: SearchParamsAdapterContext,
} = createKvant(useSearchParamsKvantAdapter)
```

### Local Storage

#### In root component

```tsx
import { LocalStorageProvider } from 'kvant/react/adapters/storage'

(
  <LocalStorageProvider>
    {children}
  </LocalStorageProvider>
)
```

#### Usage

```ts
import { LocalStorageAdapterContext, LocalStorageProvider, useLocalStorage } from 'kvant/react/adapters/storage'

const [value, setValue] = useLocalStorage('key', schema)
const [values, setValues] = useLocalStorage({ key1: schema, key2: schema })
const adapter = use(LocalStorageAdapterContext)
```

#### Manual Setup

```ts
import { StorageKvantAdapter } from 'kvant/adapters/storage'
import { createKvant } from 'kvant/react'

const {
  Provider: LocalStorageProvider,
  useState: useLocalStorage,
  AdapterContext: LocalStorageAdapterContext,
} = createKvant(StorageKvantAdapter, localStorage)
```

#### Using a Globally Defined Adapter

if the provider supports global definition

##### Global

```ts
import { StorageKvantAdapter } from 'kvant/adapters/storage'

const adapter = new StorageKvantAdapter(localStorage)
```

##### Usage

```ts
import { useKvantState } from 'kvant/react'

const [value, setValue] = useKvantState(adapter, 'key', schema)
const [values, setValues] = useKvantState(adapter, { key1: schema, key2: schema })
```

or via self-written helper:
```ts
import { useKvantState } from 'kvant/react'

const useLocalStorage = (...args) => useKvantState(adapter, ...args)

const [value, setValue] = useLocalStorage('key', schema)
const [values, setValues] = useLocalStorage({ key1: schema, key2: schema })
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
