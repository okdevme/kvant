import { useRouterQuery } from 'kvant/next/pages'
import { number, string } from 'kvant/schema'

export function getServerSideProps() {
  return { props: {} }
}

export default function QueryPage() {
  return <Bench />
}

function Bench() {
  const [value, setValue] = useRouterQuery('test', string())
  const [count, setCount] = useRouterQuery('count', number())

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <button id="clear" onClick={() => setValue(undefined)}>
        Clear
      </button>
      <button id="increment" onClick={() => setCount(c => (c ?? 0) + 1)}>
        Increment
      </button>
      <pre id="state">{value ?? ''}</pre>
      <pre id="count">{count ?? ''}</pre>
    </>
  )
}
