import { testHydration } from '@kvant/e2e-shared/hydration'

testHydration('next app router', '/hydration', {
  origin: 'http://localhost:3105',
  query: true,
})
