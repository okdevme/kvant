<script setup lang="ts">
import { computed } from 'vue'
import ConditionalRenderingPage from './pages/conditionalRendering.vue'
import CookieAttributesPage from './pages/cookieAttributes.vue'
import CookiesPage from './pages/cookies.vue'
import FormPage from './pages/form.vue'
import HashPreservationPage from './pages/hashPreservation.vue'
import HomePage from './pages/home.vue'
import JsonPage from './pages/json.vue'
import LinkingPage from './pages/linking.vue'
import LinkingTargetPage from './pages/linkingTarget.vue'
import LocalStoragePage from './pages/localStorage.vue'
import MultiHookSyncPage from './pages/multiHookSync.vue'
import MultiInterfacePage from './pages/multiInterface.vue'
import OptionsProviderPage from './pages/optionsProvider.vue'
import SearchParamsPage from './pages/searchParams.vue'
import SessionStoragePage from './pages/sessionStorage.vue'
import SpecialCharsPage from './pages/specialChars.vue'
import { navigate, usePath } from './router'

const path = usePath()

const routes: Record<string, any> = {
  '/': HomePage,
  '/cookies': CookiesPage,
  '/local-storage': LocalStoragePage,
  '/search-params': SearchParamsPage,
  '/conditional-rendering': ConditionalRenderingPage,
  '/hash-preservation': HashPreservationPage,
  '/linking': LinkingPage,
  '/linking-target': LinkingTargetPage,
  '/form': FormPage,
  '/special-chars': SpecialCharsPage,
  '/json': JsonPage,
  '/multi-hook-sync': MultiHookSyncPage,
  '/session-storage': SessionStoragePage,
  '/options-provider': OptionsProviderPage,
  '/multi-interface': MultiInterfacePage,
  '/cookie-attributes': CookieAttributesPage,
}

const current = computed(() => routes[path.value] ?? HomePage)
</script>

<template>
  <nav>
    <a href="/" @click.prevent="navigate('/')">home</a> |
    <a href="/cookies" @click.prevent="navigate('/cookies')">cookies</a> |
    <a href="/local-storage" @click.prevent="navigate('/local-storage')">local storage</a> |
    <a href="/search-params" @click.prevent="navigate('/search-params')">search params</a> |
    <a href="/conditional-rendering" @click.prevent="navigate('/conditional-rendering')">conditional</a> |
    <a href="/hash-preservation#section" @click.prevent="navigate('/hash-preservation')">hash</a>
  </nav>
  <component :is="current" />
</template>
