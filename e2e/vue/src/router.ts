import { onMounted, onUnmounted, ref } from 'vue'

export function usePath() {
  const path = ref(window.location.pathname)
  const onPopState = () => {
    path.value = window.location.pathname
  }
  onMounted(() => window.addEventListener('popstate', onPopState))
  onUnmounted(() => window.removeEventListener('popstate', onPopState))
  return path
}

export function navigate(to: string) {
  window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function replace(to: string) {
  window.history.replaceState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
