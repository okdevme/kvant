import { useSearchParams } from 'kvant/react'
import { string } from 'kvant/schema'

export function ScrollPage() {
  const [value, setValue] = useSearchParams('test', string())
  const [, setScrollValue] = useSearchParams('test', string(), { scroll: true })

  return (
    <>
      <div style={{ height: '3000px' }}>
        Tall filler
      </div>
      <button id="write-default" onClick={() => setValue('default')}>
        Write default
      </button>
      <button id="write-scroll" onClick={() => setScrollValue('scroll')}>
        Write scroll
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}
