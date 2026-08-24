import { useSearchParams } from 'kvantjs/react'
import * as z from 'zod'

// Doc pattern (_zod.mdx): total schema via .catch().
const pageSchema = z.coerce.number().min(1).catch(1)

export function ZodSchemaPage() {
  const [value, setValue] = useSearchParams('test', pageSchema)

  return (
    <>
      <button id="set-valid" onClick={() => setValue(42)}>
        Set valid
      </button>
      <button id="set-invalid" onClick={() => setValue(0)}>
        Set invalid
      </button>
      <pre id="state">{String(value)}</pre>
    </>
  )
}
