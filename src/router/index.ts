import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/posts',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  if (to.matched.length === 0) {
    return { name: authStore.token ? 'home' : 'login' }
  }

  if (to.meta.requiresAuth && !authStore.token) {
    return { name: 'login' }
  } else if (to.name === 'login' && authStore.token) {
    return { name: 'home' }
  }
})

export default router
