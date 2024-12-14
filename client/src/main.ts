import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 导入Unocss
import 'uno.css'
import 'katex/dist/katex.min.css'
import '@/assets/styles/highlight.less'
import '@/assets/styles/github-markdown.less'

import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// highlightjs
import hljs from 'highlight.js'
VMdEditor.use(githubTheme, {
  Hljs: hljs
})

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia().use(piniaPersist))
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.use(VMdEditor)

app.mount('#app')
