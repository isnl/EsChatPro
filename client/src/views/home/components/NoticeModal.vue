<script lang="ts" setup>
interface Notice {
  _id: string
  title: string
  content: string
}
import { useLoginStore } from '@/stores/login'
import { useNoticeStore } from '@/stores/notice'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
const loginStore = useLoginStore()
const noticeStore = useNoticeStore()

watch(
  () => loginStore.isLogin,
  (isLogin) => {
    if (isLogin) {
      noticeStore.getLatestNotice()
    }
  }
)
const onReaded = () => {
  ElMessage.success('当前消息不再主动弹出，如需重新查看请点击 "网站公告" ')
  noticeStore.setVisible(false)
}
</script>
<template>
  <el-dialog
    class="sm:w-160 w-95%"
    :title="noticeStore.noticeInfo?.title"
    align-center
    :model-value="noticeStore.visible"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div v-html="noticeStore.noticeInfo?.content"></div>
    <template #footer>
      <el-button type="success" @click="onReaded">不再弹出</el-button>
    </template>
  </el-dialog>
</template>
