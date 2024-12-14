<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import IconVip from '@/components/icons/IconVip.vue'
import { service } from '@/service'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AVATARS } from './constant'
import moment from 'moment'
import { DailyLimit } from '@/constants'
import { copy } from '@/hooks/useCopy'

const userStore = useUserStore()
const chatStore = useChatStore()

const { getUserInfo, setVipDialogVisible } = useUserStore()
const { userInfo, vipDialogVisible } = storeToRefs(userStore)

const nameVisible = ref(false)
const inputName = ref('')
const nameInputRef = ref()
const confirmLoading = ref(false)
const syncLoading = ref(false)
const vipCompareList = ref([
  {
    type: '普通用户',
    daily_limit: DailyLimit,
    max_length: '2,000',
    systemRole: '不支持',
    sync: '不支持',
    price: '免费',
    other: '适当放开'
  },
  {
    type: 'VIP用户',
    daily_limit: 99,
    max_length: '10,000',
    systemRole: '支持',
    sync: '支持',
    price: '9.9',
    other: '优先使用'
  }
])

const avatarVisible = ref(false)
const avatarSelected = ref('')

const vipInputRef = ref()
const couponCode = ref('')

onBeforeMount(() => {
  getUserInfo()
})

const percentage = computed(() => {
  return (userInfo.value.current / userInfo.value.daily_limit) * 100
})
const colors = [
  { color: '#e6a23c', percentage: 20 },
  { color: '#5cb87a', percentage: 40 },
  { color: '#1989fa', percentage: 60 },
  { color: '#6f7ad3', percentage: 80 },
  { color: '#f56c6c', percentage: 100 }
]

const openNameDialog = () => {
  inputName.value = userInfo.value.name
  nameVisible.value = true
}
const onNameDialogOpened = () => {
  nameInputRef.value.focus()
}
const onNameDialogClosed = () => {
  inputName.value = ''
}
const onVipDialogOpened = () => {
  vipInputRef.value.focus()
}
const onVipDialogClosed = () => {
  couponCode.value = ''
}
const onOpenAvatarDialog = () => {
  avatarSelected.value = userInfo.value.avatar
  avatarVisible.value = true
}
const onAvatarClick = (avatar: string) => {
  avatarSelected.value = avatar
}
const onNameSubmit = () => {
  updateUserInfo({
    name: inputName.value
  })
}
const onAvatarSubmit = () => {
  updateUserInfo({
    avatar: avatarSelected.value
  })
}
const updateUserInfo = async (params: { name?: string; avatar?: string }) => {
  confirmLoading.value = true
  await service.put('/user', params)
  confirmLoading.value = false
  nameVisible.value = false
  avatarVisible.value = false
  ElMessage.success('修改成功')
  getUserInfo()
}
const openVipDialog = () => {
  setVipDialogVisible(true)
}
const onVipSubmit = async () => {
  confirmLoading.value = true
  try {
    const params = {
      code: couponCode.value
    }
    await service.post('user/useCoupon', params)
    ElMessage.success('激活成功')
    couponCode.value = ''
    setVipDialogVisible(false)
    getUserInfo()
  } catch (error) {}
  confirmLoading.value = false
}
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 1) {
    return 'success-row'
  }
  return ''
}
/**
 * 数据同步  上传
 * 正在同步或者正在生成数据的时候禁止再次点击
 */
const onSyncDataPush = async () => {
  if (!userStore.isVip) {
    ElMessage.warning('数据同步仅对VIP用户开放')
    setVipDialogVisible(true)
    return
  }
  if (syncLoading.value || chatStore.generateLoading) return
  const str = `确定将当前本地数据同步至远程吗？`
  ElMessageBox.confirm(str, '重要提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    autofocus: false,
    type: 'warning'
  })
    .then(async () => {
      try {
        syncLoading.value = true
        await service.post('sync', {
          chatInfo: chatStore.chatInfo
        })
        syncLoading.value = false
        ElMessage.success('数据同步-上传成功')
      } catch (error) {
        syncLoading.value = false
      }
    })
    .catch((err) => {})
}
/**
 * 数据同步  下载
 * 正在同步或者正在生成数据的时候禁止再次点击
 */
const onSyncDataPull = async () => {
  if (!userStore.isVip) {
    ElMessage.warning('数据同步仅对VIP用户开放')
    setVipDialogVisible(true)
    return
  }
  if (syncLoading.value || chatStore.generateLoading) return
  syncLoading.value = true
  const res = await service.get('sync')
  syncLoading.value = false
  if (res.data) {
    const { version } = res.data
    if (version === chatStore.version) {
      ElMessage.warning('当前已是最新版本，无需同步。')
    } else {
      const str = `确定将您于 ${moment(version).format(
        'YYYY-MM-DD HH:mm:ss'
      )} 上传的远程数据同步至本地吗？`
      ElMessageBox.confirm(str, '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        autofocus: false,
        type: 'warning'
      })
        .then(() => {
          const { version, chatInfo } = res.data
          chatStore.setSyncData({ version, chatInfo })
        })
        .catch((err) => {})
    }
  } else {
    ElMessage.warning('您还未给远程同步任何数据。')
  }
}

const onCopyOpenId = () => {
  const str = `获取会员${userInfo.value.openId}`
  copy(str, '复制指令成功，发送给小助手即可自动获取')
}
</script>

<template>
  <div class="w-full bbl p-4 min-h-50">
    <el-progress
      type="dashboard"
      :percentage="percentage ? percentage : 0"
      :color="colors"
      :stroke-width="8"
      :width="180"
      class="w-full flex flex-col items-center"
    >
      <template #default>
        <div class="w-full flex flex-col items-center">
          <div
            class="b-rd-[50%] bg-gray-200 flex w-18 h-18 p-2 cursor-pointer relative hover-animate-spin"
            @click="onOpenAvatarDialog"
          >
            <img
              class="w-full h-full b-rd-[50%]"
              :src="`/avatar/${userInfo.avatar}.svg`"
              v-show="userInfo.avatar"
            />
          </div>
          <div class="mt-2 text-sm fc">
            <span>{{ userInfo.name }}</span>
            <el-icon @click="openNameDialog" class="cursor-pointer ml-2"><Edit /></el-icon>
          </div>
          <div class="absolute top-24">
            <el-popover
              placement="top"
              :title="userInfo.vipInfo ? 'VIP有效期' : '开通VIP'"
              :width="280"
              trigger="hover"
            >
              <template #reference>
                <el-icon
                  @click="openVipDialog"
                  class="cursor-pointer text-8 text-#aaa"
                  :class="userInfo.vipInfo ? 'text-#f2ca5b' : ''"
                  ><IconVip
                /></el-icon>
              </template>
              <template #default>
                <div v-if="userInfo.vipInfo" class="flex items-center">
                  <div>
                    {{ moment(userInfo.vipInfo.startTime).format('YYYY-MM-DD') }} -
                    {{ moment(userInfo.vipInfo.endTime).format('YYYY-MM-DD') }}
                  </div>
                  <el-link class="ml-2" type="primary" @click="openVipDialog">续费</el-link>
                </div>
                <div v-else>
                  您还不是VIP，<el-link type="warning" @click="openVipDialog">
                    点我激活VIP
                  </el-link>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
      </template>
    </el-progress>
    <div class="w-full flex justify-center items-center text-sm text-[#a0a0a0] text-xs">
      <span>当天调用次数：</span>
      <span class="text-green-4">{{ userInfo.current }}</span>
      <span class="m-x-1">/</span>
      <span class="font-500 text-red-5">{{ userInfo.daily_limit }}</span>
      <el-popover placement="left" v-if="!userInfo.vipInfo" :width="280" trigger="hover">
        <template #reference>
          <el-icon class="ml-2 cursor-pointer"><Warning /></el-icon>
        </template>
        <template #default>
          <div class="flex flex-wrap items-center">
            <el-link type="warning" @click="openVipDialog" class="whitespace-nowrap">
              开通VIP
            </el-link>
            <span>立享每日99次调用额度及 10,000 字超长文本输入上限特权</span>
          </div>
        </template>
      </el-popover>
    </div>
    <div class="w-full fc py-2 text-[#666]">
      <span class="text-xs">数据同步：</span>
      <el-tooltip content="将本地数据推送至远程" placement="top">
        <div class="fc cursor-pointer hover:text-[#111]" @click="onSyncDataPush">
          <span class="text-xs">推送</span>
          <el-icon class="ml-1"><Upload /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="从远程拉取数据" placement="top">
        <div class="fc cursor-pointer ml-4 hover:text-[#111]" @click="onSyncDataPull">
          <span class="text-xs">拉取</span>
          <el-icon class="ml-1"><Download /></el-icon>
        </div>
      </el-tooltip>
    </div>
  </div>

  <!-- vip激活 -->
  <el-dialog
    class="w-200"
    align-center
    :model-value="vipDialogVisible"
    title="VIP权益对比"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @opened="onVipDialogOpened"
    @close="setVipDialogVisible(false)"
    @closed="onVipDialogClosed"
  >
    <el-table
      :data="vipCompareList"
      header-align="center"
      class="w-full"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="type" label="类型" align="center" />
      <el-table-column prop="daily_limit" label="日调用量" align="center" />
      <el-table-column prop="max_length" label="输入上限" align="center" />
      <el-table-column prop="systemRole" label="自定义角色" align="center" />
      <el-table-column prop="sync" label="数据同步" align="center" />
      <el-table-column prop="other" label="新功能尝鲜" align="center" />
    </el-table>
    <template #footer>
      <div class="flex items-center px-8">
        <el-input
          v-model="couponCode"
          :maxlength="21"
          :show-word-limit="true"
          placeholder="请输入21位卡密信息"
          ref="vipInputRef"
          @keyup.enter.native="onVipSubmit"
          class="mr-5"
        />
        <el-button
          type="success"
          :loading="confirmLoading"
          :disabled="!couponCode"
          @click="onVipSubmit"
          >立即激活</el-button
        >
      </div>
    </template>
  </el-dialog>

  <!-- 昵称修改 -->
  <el-dialog
    class="w-80"
    align-center
    v-model="nameVisible"
    title="昵称修改"
    @opened="onNameDialogOpened"
    @closed="onNameDialogClosed"
  >
    <el-input
      v-model="inputName"
      :maxlength="15"
      :show-word-limit="true"
      placeholder="请输入昵称"
      ref="nameInputRef"
      @keyup.enter.native="onNameSubmit"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button :maxLength="12" type="primary" :loading="confirmLoading" @click="onNameSubmit"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 头像修改 -->
  <el-dialog class="w-200" align-center v-model="avatarVisible" title="头像修改">
    <div class="w-full flex flex-wrap">
      <div
        class="w-10 h-10 cursor-pointer b-rd-2 hover:(bg-#ccc)"
        :class="{ 'bg-#ccc': avatarSelected === item }"
        v-for="item in AVATARS"
        @click="onAvatarClick(item)"
        :key="item"
      >
        <img class="w-full h-full b-rd-[50%]" :src="`/avatar/${item}.svg`" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button :maxLength="12" type="primary" :loading="confirmLoading" @click="onAvatarSubmit"
          >确定</el-button
        >
      </span>
    </template></el-dialog
  >
</template>
<style>
.el-table .success-row {
  /* --el-table-tr-bg-color: var(--el-color-success-light-9); */
  color: var(--el-color-success);
  font-weight: 900;
}
.el-table .success-row .el-table__cell .cell {
  font-weight: bold;
}
</style>
