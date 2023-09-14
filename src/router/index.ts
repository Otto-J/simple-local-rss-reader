import { createRouter, createWebHashHistory } from 'vue-router/auto'
// import HomeView from '@/pages/home-page.vue'
// import NotFound from '@/pages/not-found.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL)
  // routes: [
  //   {
  //     path: '/',
  //     name: 'init',
  //     redirect: 'home',
  //     children: [
  //       {
  //         // name：'home',
  //         path: 'home',
  //         component: HomeView
  //       },
  //       {
  //         name: 'list',
  //         path: 'item/:id',
  //         component: import('@/pages/detail/podcast-detail.vue'),
  //         props: true
  //       },

  //       {
  //         name: 'add-rss',
  //         path: 'add-rss',
  //         component: import('@/pages/detail/add-new-rss.vue')
  //       }
  //     ]
  //   },
  //   {
  //     path: '/:pathMatch(.*)*',
  //     name: 'NotFound',
  //     component: NotFound
  //   }

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (About.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import('../views/AboutView.vue')
  // }
  // ]
})

export default router
