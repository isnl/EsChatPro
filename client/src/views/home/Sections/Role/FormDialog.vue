<script lang="ts" setup>
import isEmpty from 'lodash/isEmpty'
import { computed, reactive, ref, toRaw, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useChatStore } from '@/stores/chat'
import type { FormInstance, FormRules } from 'element-plus'
import service from '@/service'
import NormalTitle from '@/components/NormalTitle.vue'
import type { SystemRoleSchema, SystemRoleItem } from '@/types'
import { storeToRefs } from 'pinia'
const chatStore = useChatStore()
const { currentRecord } = storeToRefs(chatStore)

export interface RuleForm {
  _id?: string
  title: string
  content: string
  context: boolean
  description: string
  isSchema: boolean
  jsonSchema?: SystemRoleSchema[]
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editInfo: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'onUpdated'])

const schema = ref<SystemRoleSchema[]>([
  {
    key: '',
    description: ''
  }
])
const addNewSchema = () => {
  schema.value.push({
    key: '',
    description: ''
  })
}
const deleteSchema = (index: number) => {
  schema.value.splice(index, 1)
}

const isCreate = computed(() => isEmpty(props.editInfo))
const title = computed(() => (isCreate.value ? '新建角色' : '修改角色'))
const loading = ref(false)

const ruleFormRef = ref<FormInstance>()

const defaultState = {
  title: '',
  content: '',
  description: '',
  context: false,
  isSchema: false
}
const ruleForm = ref<SystemRoleItem>({ ...defaultState })

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入角色标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
  content: [{ required: true, message: '请输入角色内容', trigger: 'blur' }]
})

watch(
  () => [props.editInfo, props.modelValue],
  () => {
    if (props.modelValue) {
      if (!isCreate.value) {
        const { _id, title, content, isSchema, description, context, jsonSchema } = props.editInfo
        ruleForm.value = {
          _id,
          title,
          content,
          isSchema,
          description,
          context
        }
        if (isSchema) {
          schema.value = jsonSchema
        } else {
          schema.value = []
        }
      } else {
        ruleForm.value = { ...defaultState }
        schema.value = []
      }
    }
  }
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      const action = isCreate.value ? 'post' : 'put'
      const params: SystemRoleItem = {
        ...ruleForm.value
      }
      const url = isCreate.value ? 'system_role' : `system_role/${props.editInfo._id}`
      if (ruleForm.value.isSchema) {
        params.jsonSchema = toRaw(schema.value)
      }
      service[action](url, params)
        .then((res) => {
          loading.value = false
          ElMessage.success('操作成功')
          emit('update:modelValue')
          ruleFormRef.value?.resetFields()
          emit('onUpdated', !isCreate.value ? params : undefined)
        })
        .catch((err) => {
          loading.value = false
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onClose = () => {
  emit('update:modelValue')
  ruleFormRef.value?.resetFields()
}
</script>
<template>
  <el-dialog
    :modelValue="modelValue"
    :title="title"
    :width="ruleForm.isSchema ? '70%' : '50%'"
    @close="onClose"
    align-center
  >
    <div class="w-full h-full overflow-hidden flex">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="flex-1"
      >
        <el-form-item label="角色标题" prop="title">
          <el-input
            v-model="ruleForm.title"
            maxlength="100"
            show-word-limit
            placeholder="请输入角色标题"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="ruleForm.description"
            maxlength="500"
            show-word-limit
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="角色内容" prop="content">
          <el-input
            type="textarea"
            class="w-full"
            :rows="10"
            resize="none"
            v-model="ruleForm.content"
            :show-word-limit="true"
            maxlength="10000"
            placeholder="请输入角色内容"
          />
        </el-form-item>
        <el-form-item label="开启上下文" prop="context">
          <el-switch v-model="ruleForm.context" />
        </el-form-item>
        <el-form-item label="自定义Schema" prop="isSchema">
          <el-switch v-model="ruleForm.isSchema" />
        </el-form-item>
      </el-form>
      <el-scrollbar v-if="ruleForm.isSchema" class="flex w-500px ml-30px" height="400">
        <div class="w-480px">
          <NormalTitle class="mb-20px" title="自定义Schema">
            <el-button class="w-40px h-25px ml-auto mr-10px" type="success" @click="addNewSchema">
              <el-icon><Plus /></el-icon>
            </el-button>
          </NormalTitle>
          <div v-for="(s, index) in schema" class="w-full flex items-center gap-10px my-10px">
            <el-input class="w-160px" v-model="s.key" placeholder="请输入key" />
            <el-input v-model="s.description" placeholder="请输入描述" />
            <el-button class="w-40px" @click="deleteSchema(index)" type="danger">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
