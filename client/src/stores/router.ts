import { defineStore } from 'pinia'
import service from '@/service'
import router from '@/router'
export const useRouterStore = defineStore('routerStore', {
  state: () => ({
    routeInfo: {} as RouterInfo
  }),
  actions: {
    async addRoutes() {
      const res = await service.get('admin/dynamic_routes')
      let routeInfo: RouterInfo = res.data
      this.routeInfo = routeInfo

      const modules = import.meta.glob(`@/views/admin/**/*.vue`)

      const { path, name, component, children } = routeInfo
      // /admin主路由
      router.addRoute({
        path,
        name,
        component: modules[component]
      })
      children.map((item) => {
        const { path, name, component } = item
        router.addRoute('admin', {
          path,
          name,
          component: modules[component]
        })
      })
    }
  }
})
export interface RouterInfo {
  icon: string
  name: string
  path: string
  alias?: string
  component: string
  children: RouterInfo[]
}
