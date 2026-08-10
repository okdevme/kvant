<script setup lang="ts">
import { computed } from 'vue'
import CookiesPage from './pages/cookies.vue'
import HomePage from './pages/home.vue'
import LocalStoragePage from './pages/localStorage.vue'
import SearchParamsPage from './pages/searchParams.vue'
import { navigate, usePath } from './router'

const path = usePath()

const routes: Record<string, any> = {
  '/': HomePage,
  '/cookies': CookiesPage,
  '/local-storage': LocalStoragePage,
  '/search-params': SearchParamsPage,
}

const current = computed(() => routes[path.value] ?? HomePage)
</script>

<template>
  <nav>
    <a href="/" @click.prevent="navigate('/')">home</a> |
    <a href="/cookies" @click.prevent="navigate('/cookies')">cookies</a> |
    <a href="/local-storage" @click.prevent="navigate('/local-storage')">local storage</a> |
    <a href="/search-params" @click.prevent="navigate('/search-params')">search params</a>
  </nav>
  <component :is="current" />
</template>
