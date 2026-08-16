import { ConditionalRenderingPage } from './pages/conditionalRendering'
import { CookieAttributesPage } from './pages/cookieAttributes'
import { CookiesPage } from './pages/cookies'
import { CustomSerializerPage } from './pages/customSerializer'
import { FormPage } from './pages/form'
import { HashPreservationPage } from './pages/hashPreservation'
import { HomePage } from './pages/home'
import { JsonPage } from './pages/json'
import { KeyIsolationPage } from './pages/keyIsolation'
import { LinkingPage, LinkingTargetPage } from './pages/linking'
import { LocalStoragePage } from './pages/localStorage'
import { MultiHookSyncPage } from './pages/multiHookSync'
import { MultiInterfacePage } from './pages/multiInterface'
import { OptionsProviderPage } from './pages/optionsProvider'
import { RoutingPage } from './pages/routing'
import { ScrollPage } from './pages/scroll'
import { SearchParamsPage } from './pages/searchParams'
import { SearchParamsPushPage } from './pages/searchParamsPush'
import { SessionStoragePage } from './pages/sessionStorage'
import { SpecialCharsPage } from './pages/specialChars'
import { ZodSchemaPage } from './pages/zodSchema'
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
        {' | '}
        <Link to="/conditional-rendering">conditional</Link>
        {' | '}
        <Link to="/hash-preservation#section">hash</Link>
      </nav>
      <Switch>
        <Route path="/cookies" component={CookiesPage} />
        <Route path="/local-storage" component={LocalStoragePage} />
        <Route path="/search-params" component={SearchParamsPage} />
        <Route path="/search-params-push" component={SearchParamsPushPage} />
        <Route path="/conditional-rendering" component={ConditionalRenderingPage} />
        <Route path="/hash-preservation" component={HashPreservationPage} />
        <Route path="/linking" component={LinkingPage} />
        <Route path="/linking-target" component={LinkingTargetPage} />
        <Route path="/form" component={FormPage} />
        <Route path="/special-chars" component={SpecialCharsPage} />
        <Route path="/json" component={JsonPage} />
        <Route path="/multi-hook-sync" component={MultiHookSyncPage} />
        <Route path="/key-isolation" component={KeyIsolationPage} />
        <Route path="/scroll" component={ScrollPage} />
        <Route path="/routing" component={RoutingPage} />
        <Route path="/session-storage" component={SessionStoragePage} />
        <Route path="/options-provider" component={OptionsProviderPage} />
        <Route path="/multi-interface" component={MultiInterfacePage} />
        <Route path="/cookie-attributes" component={CookieAttributesPage} />
        <Route path="/zod-schema" component={ZodSchemaPage} />
        <Route path="/custom-serializer" component={CustomSerializerPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </>
  )
}
