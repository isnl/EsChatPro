// 引入vue和vueuse相关模块
import { ref, watch, onMounted } from 'vue'
import { useWindowFocus } from '@vueuse/core'

// 定义自定义hook函数
export default function usePageActive() {
  // 记录上次页面活跃的时间
  const lastActiveTime = ref(Date.now())

  // 监听窗口的活性状态
  const isWindowFocused = useWindowFocus()
  watch(isWindowFocused, (value) => {
    // 当失去焦点时，将上次活跃时间更新为当前时间
    if (!value) {
      lastActiveTime.value = Date.now()
    }
  })

  // 在组件挂载后每隔20分钟检查一次是否超过1小时未活跃
  onMounted(() => {
    setInterval(() => {
      if (!isWindowFocused.value && Date.now() - lastActiveTime.value > 1 * 60 * 60 * 1000) {
        // 窗口失去焦点并且超过1小时未活跃，刷新页面
        location.reload()
      }
    }, 20 * 60 * 1000) // 20分钟检查一次
  })
}

// 导出自定义hook函数
export { usePageActive }
