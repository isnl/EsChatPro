import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/home/index.vue'
import ShareView from '../views/share/index.vue'
import TimelineView from '../views/timeline/index.vue'
import { useUserStore } from '@/stores/user'
import { useRouterStore } from '@/stores/router'
import isEmpty from 'lodash/isEmpty'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: TimelineView
    },
    {
      path: '/share/:id',
      name: 'share',
      component: ShareView
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const routerStore = useRouterStore()
  if (to.path.includes('admin')) {
    if (!isEmpty(routerStore.routeInfo)) {
      next()
    } else {
      const isAdministrators = await userStore.getUserInfo()
      if (isAdministrators) {
        next({
          path: to.path,
          replace: true
        })
      } else {
        next({
          path: '/',
          replace: true
        })
      }
    }
  } else {
    next()
  }
})

export default router
