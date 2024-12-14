import { ref, onMounted, onBeforeMount } from 'vue'

export default function useIsMobile() {
  const isMobile = ref(false)

  onBeforeMount(() => {
    const userAgentInfo = navigator.userAgent
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    for (let i = 0; i < Agents.length; i++) {
      if (userAgentInfo.indexOf(Agents[i]) > 0) {
        isMobile.value = true
        break
      }
    }
  })

  return {
    isMobile
  }
}
