import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const HomeView = { template: '<h1>Ești logat cu succes.</h1>' }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('../views/PlayersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/players/create',
      name: 'player-create',
      component: () => import('../views/PlayerCreateView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/players/:id',
      name: 'player-detail',
      component: () => import('../views/PlayerDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/players/:id/edit',
      name: 'player-edit',
      component: () => import('../views/PlayerEditView.vue'),
      meta: { requiresAuth: true },
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  authStore.checkAuth() 

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router