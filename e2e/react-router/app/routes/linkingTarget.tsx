import { useSearchParams } from 'kvant/react-router'
import { string } from 'kvant/schema'

export default function LinkingTargetPage() {
  const [value] = useSearchParams('test', string())

  return <pre id="state">{value ?? ''}</pre>
}
