import type { FormEvent } from 'react'
import { useSearchParams } from 'kvant/react-router'
import { string } from 'kvant/schema'

export default function FormPage() {
  const [value, setValue] = useSearchParams('test', string())

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setValue(String(data.get('test') ?? ''))
  }

  return (
    <>
      <form id="form" onSubmit={onSubmit}>
        <input id="input" name="test" defaultValue={value ?? ''} />
        <button id="submit" type="submit">
          Submit
        </button>
      </form>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}
