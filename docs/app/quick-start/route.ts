import { redirect } from 'next/navigation'
import { getServerCookieFrameworkId } from '@/lib/frameworks.server'

export async function GET() {
  return redirect(`/docs/${await getServerCookieFrameworkId()}/quick-start`)
}
