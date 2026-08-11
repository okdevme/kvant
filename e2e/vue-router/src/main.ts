import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app.vue'
import ConditionalRenderingPage from './pages/conditionalRendering.vue'
import FormPage from './pages/form.vue'
import HashPreservationPage from './pages/hashPreservation.vue'
import HomePage from './pages/home.vue'
import JsonPage from './pages/json.vue'
import KeyIsolationPage from './pages/keyIsolation.vue'
import LinkingPage from './pages/linking.vue'
import LinkingTargetPage from './pages/linkingTarget.vue'
import MultiHookSyncPage from './pages/multiHookSync.vue'
import ParamsPage from './pages/params.vue'
import QueryPage from './pages/query.vue'
import QueryPushPage from './pages/queryPush.vue'
import RoutingPage from './pages/routing.vue'
import SpecialCharsPage from './pages/specialChars.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/query', component: QueryPage },
    { path: '/query-push', component: QueryPushPage },
    { path: '/params/:id?/:tab?', component: ParamsPage },
    { path: '/conditional-rendering', component: ConditionalRenderingPage },
    { path: '/hash-preservation', component: HashPreservationPage },
    { path: '/linking', component: LinkingPage },
    { path: '/linking-target', component: LinkingTargetPage },
    { path: '/form', component: FormPage },
    { path: '/special-chars', component: SpecialCharsPage },
    { path: '/json', component: JsonPage },
    { path: '/multi-hook-sync', component: MultiHookSyncPage },
    { path: '/key-isolation', component: KeyIsolationPage },
    { path: '/routing', component: RoutingPage },
  ],
})

createApp(App).use(router).mount('#app')
