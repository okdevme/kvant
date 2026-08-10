import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app.vue'
import HomePage from './pages/home.vue'
import ParamsPage from './pages/params.vue'
import QueryPage from './pages/query.vue'
import QueryPushPage from './pages/queryPush.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/query', component: QueryPage },
    { path: '/query-push', component: QueryPushPage },
    { path: '/params/:id?/:tab?', component: ParamsPage },
  ],
})

createApp(App).use(router).mount('#app')
