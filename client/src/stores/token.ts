import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore(
  'tokenStore',
  () => {
    const token = ref('')
    function setToken(val: string) {
      token.value = val
    }

    return {
      token,
      setToken
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'token',
          storage: localStorage,
        }
      ]
    }
  }
)
