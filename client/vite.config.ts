import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入Unocss
import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      // 使用Unocss
      presets: [presetUno(), presetAttributify(), presetIcons()],
      shortcuts: [
        {
          fc: 'flex justify-center items-center',
          bl: 'b-1 b-solid b-gray-200 dark:b-gray-6',
          brl: 'b-r-1 b-r-solid b-r-gray-200 dark:b-r-gray-6',
          bbl: 'b-b-1 b-b-solid b-b-gray-200 dark:b-b-gray-6',
          btl: 'b-t-1 b-t-solid b-t-gray-200 dark:b-t-gray-6',
          bll: 'b-l-1 b-l-solid b-l-gray-200 dark:b-l-gray-6',
          ellipsis: 'overflow-hidden text-ellipsis whitespace-nowrap'
        }
      ],
      transformers: [transformerVariantGroup()]
    })
  ],
  server: {
    port: 5273,
    host: '0.0.0.0'
  },
  build: {
    outDir: '../server/clientDist'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
