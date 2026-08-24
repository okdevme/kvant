import { testHydration } from '@kvant/e2e-shared/hydration'

testHydration('nuxt', '/hydration', {
  origin: 'http://localhost:3106',
  storage: true,
  // Nuxt's useCookie renders the request cookie on the server.
  cookieSsrState: 'client',
})
