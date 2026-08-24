import type { RouteConfig } from '@react-router/dev/routes'
import { index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('search-params', 'routes/searchParams.tsx'),
  route('search-params-push', 'routes/searchParamsPush.tsx'),
  route('cookies', 'routes/cookies.tsx'),
  route('conditional-rendering', 'routes/conditionalRendering.tsx'),
  route('hash-preservation', 'routes/hashPreservation.tsx'),
  route('linking', 'routes/linking.tsx'),
  route('linking-target', 'routes/linkingTarget.tsx'),
  route('form', 'routes/form.tsx'),
  route('special-chars', 'routes/specialChars.tsx'),
  route('json', 'routes/json.tsx'),
  route('multi-hook-sync', 'routes/multiHookSync.tsx'),
  route('scroll', 'routes/scroll.tsx'),
  route('routing', 'routes/routing.tsx'),
  route('cookie-attributes', 'routes/cookieAttributes.tsx'),
  route('hydration', 'routes/hydration.tsx'),
] satisfies RouteConfig
