<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import IconVipActive from '@/components/icons/IconVipActive.vue'
import IconNotice from '@/components/icons/IconNotice.vue'
import IconUpdateRecord from '@/components/icons/IconUpdateRecord.vue'
import IconWeixin from '@/components/icons/IconWeixin.vue'
import IconMoon from '@/components/icons/IconMoon.vue'
import GithubSvg from '@/components/icons/IconGithub.vue'
import ShareSvg from '@/components/icons/IconShare.vue'
import { useUserStore } from '@/stores/user'
import { copy } from '@/hooks/useCopy'
import { useNoticeStore } from '@/stores/notice'
import { useHomeStore } from '@/stores/home'
import { useDark } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import service from '@/service'
import { storeToRefs } from 'pinia'
import useIsMobile from '@/hooks/useIsMobile'

const userStore = useUserStore()
const noticeStore = useNoticeStore()
const homeStore = useHomeStore()
const isDark = useDark()
const { isMobile } = useIsMobile()

const { setMenuExpand } = homeStore
const { menuExpand } = storeToRefs(homeStore)

onBeforeMount(() => {
  if (isMobile.value) {
    setMenuExpand(false)
  }
})

const toggleDark = () => {
  isDark.value = !isDark.value
}

const shareList = ref([])
const shareTotal = ref(0)
const shareVisible = ref(false)

const openShareManage = () => {
  shareVisible.value = true
}
const getShareList = async () => {
  const res: any = await service.get('user/share')
  shareList.value = res.data.list
  shareTotal.value = res.data.total
}
const copyPassword = (password: string) => {
  copy(password)
  ElMessage.success('复制成功')
}
/**
 * 删除分享
 */
const deleteRecord = async (id: string) => {
  await service.delete(`user/share/${id}`)
  ElMessage.success('删除成功')
  getShareList()
}

const onToggleExpand = () => {
  if (isMobile.value) return
  setMenuExpand(!menuExpand.value)
}

const menuItemClass = computed(() => {
  return `w-full h-35px border-rd-5px cursor-pointer flex decoration-none items-center text-#2c3e50 hover:bg-[#f0f0f0] dark-hover:bg-[#666] dark-text-[#b4bbc4] overflow-hidden box-border ${
    menuExpand.value ? 'pl-10px' : 'justify-center pl0'
  }`
})
const locationOrigin = location.origin
</script>
<template>
  <div
    class="h-full flex-col bg-#fff sm:border-rd-r-10px sm:dark:bg-#333 dark:bg-#141414 transition-all"
    :class="menuExpand ? 'w-140px' : 'w-55px'"
  >
    <div class="w-full flex justify-center items-center pt-200px pb-20px">
      <img
        class="cursor-pointer hover-animate-spin"
        src="/favicon.svg"
        @click="onToggleExpand"
        :class="menuExpand ? 'w-60px h-60px' : 'w-30px h-30px'"
      />
    </div>
    <div class="flex-1 px-10px flex flex-col gap-10px">
      <a target="_blank" href="https://github.com/isnl/EsChatPro" :class="menuItemClass">
        <el-tooltip content="开源地址" placement="right" :disabled="menuExpand">
          <el-icon :class="menuExpand ? '' : 'text-20px'" class="text-16px"><GithubSvg /></el-icon>
        </el-tooltip>
        <span v-if="menuExpand" class="flex-1 overflow-hidden whitespace-nowrap ml-5px text-xs"
          >开源地址</span
        >
      </a>
      <div :class="menuItemClass" @click="noticeStore.setVisible(true)">
        <el-tooltip content="网站公告" placement="right" :disabled="menuExpand">
          <el-icon :class="menuExpand ? '' : 'text-20px'" class="text-16px"><IconNotice /></el-icon>
        </el-tooltip>
        <span v-if="menuExpand" class="flex-1 overflow-hidden whitespace-nowrap ml-5px text-xs"
          >网站公告</span
        >
      </div>
      <RouterLink target="_blank" to="/timeline" :class="menuItemClass">
        <el-tooltip content="更新记录" placement="right" :disabled="menuExpand">
          <el-icon :class="menuExpand ? '' : 'text-20px'" class="text-16px"
            ><IconUpdateRecord
          /></el-icon>
        </el-tooltip>
        <span v-if="menuExpand" class="flex-1 overflow-hidden whitespace-nowrap ml-5px text-xs"
          >更新记录</span
        >
      </RouterLink>
      <div :class="menuItemClass" @click="userStore.setVipDialogVisible(true)">
        <el-tooltip content="VIP激活" placement="right" :disabled="menuExpand">
          <el-icon :class="menuExpand ? '' : 'text-20px'" class="text-16px"
            ><IconVipActive
          /></el-icon>
        </el-tooltip>
        <span v-if="menuExpand" class="flex-1 overflow-hidden whitespace-nowrap ml-5px text-xs"
          >VIP激活</span
        >
      </div>
      <div :class="menuItemClass" @click="openShareManage">
        <el-tooltip content="分享管理" placement="right" :disabled="menuExpand">
          <el-icon :class="menuExpand ? '' : 'text-20px'" class="text-16px"><ShareSvg /></el-icon>
        </el-tooltip>
        <span v-if="menuExpand" class="flex-1 overflow-hidden whitespace-nowrap ml-5px text-xs"
          >分享管理</span
        >
      </div>
      <div :class="menuItemClass" @click="toggleDark">
        <el-tooltip
          :content="isDark ? '浅色模式' : '深色模式'"
          placement="right"
          :disabled="menuExpand"
        >
          <el-icon :class="menuExpand ? '' : 'text-20px'" class="text-16px">
            <Sunny v-if="!isDark" />
            <IconMoon v-else />
          </el-icon>
        </el-tooltip>
        <span v-if="menuExpand" class="flex-1 overflow-hidden whitespace-nowrap ml-5px text-xs">{{
          isDark ? '浅色模式' : '深色模式'
        }}</span>
      </div>
      <RouterLink
        to="/admin"
        :class="menuItemClass"
        v-if="userStore.isAdministrators"
        target="_blank"
        href="#/admin/dashboard"
      >
        <el-tooltip content="后台管理" placement="right" :disabled="menuExpand">
          <el-icon :class="menuExpand ? '' : 'text-20px'" class="text-16px"><Menu /></el-icon>
        </el-tooltip>
        <span v-if="menuExpand" class="flex-1 overflow-hidden whitespace-nowrap ml-5px text-xs"
          >后台管理</span
        >
      </RouterLink>
    </div>
  </div>

  <el-dialog
    class="w-90% sm:w-60%"
    align-center
    title="分享管理"
    v-model="shareVisible"
    @opened="getShareList"
  >
    <el-table :data="shareList" class="w-full min-h-60">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column prop="_id" label="访问地址" width="420">
        <template #default="scope">
          <el-link target="_blank" type="primary" :href="`${locationOrigin}/#/share/${scope.row._id}`">{{
            `${locationOrigin}/#/share/${scope.row._id}`
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="password" label="访问密码">
        <template #default="scope">
          <div class="flex items-center">
            <span>{{ scope.row.password }}</span>
            <el-icon
              @click="copyPassword(scope.row.password)"
              class="text-[#aaaaaa] cursor-pointer hover:text-[#333] ml-2"
              ><CopyDocument
            /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-popconfirm
            title="删除后不可恢复，确定删除吗?"
            :width="200"
            @confirm="deleteRecord(scope.row._id)"
            confirm-button-type="danger"
            confirm-button-text="确定"
            cancel-button-text="取消"
          >
            <template #reference>
              <el-button link type="danger" size="small"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
