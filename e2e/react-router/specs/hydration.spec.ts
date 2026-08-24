import { testHydration } from '@kvant/e2e-shared/hydration'

testHydration('react-router', '/hydration', {
  origin: 'http://localhost:3102',
  query: true,
})
