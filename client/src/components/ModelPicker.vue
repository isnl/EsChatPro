<script lang="ts" setup>
import { ref } from 'vue'
import { useModelStore } from '@/stores/model'
import { storeToRefs } from 'pinia'
import type { IModel } from '@/types'
import { ElMessage } from 'element-plus'
import IconRecommend from './icons/IconRecommend.vue'
const modelStore = useModelStore()

const { setCurrentModel } = modelStore

const { modelList, currentModel } = storeToRefs(modelStore)
const onChangeModel = (model: IModel) => {
  setCurrentModel(model)
  ElMessage.closeAll()
  ElMessage.success(`切换模型成功 - ${model.name}`)
}
</script>
<template>
  <el-dialog class="w-95% sm:w-300" title="模型切换" align-center v-model="modelStore.visible">
    <el-scrollbar :height="540" class="w-full h-full sm:pr-20px">
      <el-card
        shadow="hover"
        v-for="model in modelList"
        :key="model._id"
        class="mb-20px cursor-pointer relative"
        @click="onChangeModel(model)"
      >
        <div class="w-full flex items-center">
          <el-checkbox :model-value="model._id === currentModel._id"></el-checkbox>
          <div class="flex flex-col ml-20px">
            <h3>{{ model.name }}</h3>
            <p>{{ model.description }}</p>
          </div>
        </div>
        <div class="absolute left-0 top-0" v-if="model.isBetter">
          <IconRecommend class="w-42px h-42px" />
        </div>
      </el-card>
    </el-scrollbar>
  </el-dialog>
</template>
