import { CookiesPage } from './pages/cookies'
import { HomePage } from './pages/home'
import { LocalStoragePage } from './pages/localStorage'
import { SearchParamsPage } from './pages/searchParams'
import { SearchParamsPushPage } from './pages/searchParamsPush'
import { Link, Route, Switch } from './router'

export function App() {
  return (
    <>
      <nav>
        <Link to="/">home</Link>
        {' | '}
        <Link to="/cookies">cookies</Link>
        {' | '}
        <Link to="/local-storage">local storage</Link>
        {' | '}
        <Link to="/search-params">search params</Link>
        {' | '}
        <Link to="/search-params-push">search params (push)</Link>
      </nav>
      <Switch>
        <Route path="/cookies" component={CookiesPage} />
        <Route path="/local-storage" component={LocalStoragePage} />
        <Route path="/search-params" component={SearchParamsPage} />
        <Route path="/search-params-push" component={SearchParamsPushPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </>
  )
}
