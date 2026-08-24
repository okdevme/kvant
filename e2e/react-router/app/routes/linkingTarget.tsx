import { useSearchParams } from 'kvantjs/react-router'
import { string } from 'kvantjs/schema'

export default function LinkingTargetPage() {
  const [value] = useSearchParams('test', string())

  return <pre id="state">{value ?? ''}</pre>
}
