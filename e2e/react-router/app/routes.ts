import type { RouteConfig } from '@react-router/dev/routes'
import { index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('search-params', 'routes/searchParams.tsx'),
  route('search-params-push', 'routes/searchParamsPush.tsx'),
  route('cookies', 'routes/cookies.tsx'),
] satisfies RouteConfig
