<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useChatStore } from '@/stores/chat'
import IconSetTop from '@/components/icons/IconSetTop.vue'
import IconSystemRole from '@/components/icons/IconSystemRole.vue'
import type { RecordItem } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import moment from 'moment'

const chatStore = useChatStore()

const { addRecord, deleteRecord, updateRecord, setActive } = chatStore
const { chatInfo } = storeToRefs(chatStore)

const isEdit = ref(false)
const recordName = ref('')

const onChange = (id: string) => {
  if (chatStore.generateLoading) return
  setActive(id)
}
const onEditRecord = (item: RecordItem) => {
  isEdit.value = true
  recordName.value = item.name
}
const onEditOk = (item: RecordItem) => {
  const { id } = item
  updateRecord(id, recordName.value)
  onEditCancel()
  ElMessage.success('修改成功')
}
const onEditCancel = () => {
  isEdit.value = false
  recordName.value = ''
}
</script>

<template>
  <div class="w-full h-full flex-1 flex flex-col items-center overflow-hidden">
    <div class="w-full flex-1 flex flex-col overflow-hidden">
      <div
        class="mt-2 mr-3 bl b-style-dashed fc py-2 text-xs dark-text-[#b4bbc4] cursor-pointer border-rd-1 hover:bg-[#f5f5f5] dark-hover:bg-[#333]"
        @click="addRecord()"
      >
        新建对话
      </div>
      <!-- records -->
      <el-scrollbar height="100%" class="flex-1 pr-3 pt-0 text-[#2f2f32]">
        <div
          class="w-full h-10 px-3 my-3 border-rd-2 bl flex items-center gap-2 dark-text-[#b4bbc4] cursor-pointer hover:bg-[#f5f5f5] dark-hover:bg-[#333]"
          :class="
            item.id === chatInfo.active
              ? 'text-[var(--el-color-success)] dark-text-[var(--el-color-success)] bg-[#f5f5f5] dark-bg-[#333] b-color-[var(--el-color-success)] dark-b-color-[var(--el-color-success)]'
              : ''
          "
          v-for="item in chatInfo.record"
          @click="onChange(item.id)"
          :key="item.id"
        >
          <el-icon :class="{ 'text-red': item.systemRole ? true : false }">
            <IconSystemRole v-if="item.systemRole" />
            <ChatDotSquare v-else />
          </el-icon>
          <el-input
            size="small"
            v-model="recordName"
            maxlength="50"
            @keyup.enter.native="onEditOk(item)"
            v-if="isEdit && item.id === chatInfo.active"
          />
          <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs" v-else>{{
            item.name
          }}</span>
          <template v-if="isEdit && item.id === chatInfo.active">
            <el-icon @click="onEditOk(item)"><Check /></el-icon>
            <el-icon @click="onEditCancel"><Close /></el-icon>
          </template>
          <template
            v-if="!isEdit && item.id === chatInfo.active && chatInfo.record.length > 1"
          >
            <el-icon @click="onEditRecord(item)"><Edit /></el-icon>
            <el-popconfirm
              title="删除后不可恢复，确定删除吗？"
              :width="200"
              @confirm="deleteRecord(item.id)"
              confirm-button-type="danger"
              confirm-button-text="确定"
              cancel-button-text="取消"
            >
              <template #reference>
                <el-icon><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
