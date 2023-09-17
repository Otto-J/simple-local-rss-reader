import { createRouter, createWebHashHistory } from 'vue-router/auto'
// import HomeView from '@/pages/home-page.vue'
// import NotFound from '@/pages/not-found.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL)
})

export default router
