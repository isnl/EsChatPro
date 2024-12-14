<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '@/stores/login'
import { useTokenStore } from '@/stores/token'
import service from '@/service'
const loginStore = useLoginStore()
const { setVisible, setIsLogin } = loginStore
const tokenStore = useTokenStore()

const verifyLoading = ref(false)
const code = ref('')
const inputRef = ref<HTMLInputElement>()
const loginType = ref('mp')

const onVerifyCode = () => {
  verifyLoading.value = true
  service
    .get('/wechat/verify', { code: code.value, loginType: loginType.value })
    .then((res) => {
      const token = res.data
      tokenStore.setToken(token)
      ElMessage.success('登录成功')
      setVisible(false)
      setIsLogin(true)
      code.value = ''
      verifyLoading.value = false
    })
    .catch((err) => {
      verifyLoading.value = false
    })
}
const onOpen = () => {
  inputRef.value?.focus()
}
</script>

<template>
  <el-dialog
    class="loginDialog w-84"
    align-center
    :model-value="loginStore.visible"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @opened="onOpen"
  >
    <div class="w-full flex flex-col justify-center items-center">
      <el-tabs v-model="loginType" @tab-click="code = ''">
        <el-tab-pane label="公众号登录" name="mp" class="flex flex-col items-center">
          <div>扫码关注后，发送 <span class="fw-500 text-red">登录</span> 获取验证码</div>
          <img src="/static/imgs/mp_qrcode.jpg" alt="" />
          <div class="flex items-center">
            <el-input
              ref="inputRef"
              class="w-165px"
              maxlength="6"
              placeholder="请输入验证码以登录"
              v-model="code"
              @keyup.enter="onVerifyCode"
              :autofocus="true"
            ></el-input>
            <el-button class="flex-1" type="primary" @click="onVerifyCode" :loading="verifyLoading"
              >确定</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="授权码登录" name="authCode">
          <div flex items-center>
            <el-input
              ref="inputRef"
              class="w-165px"
              maxlength="50"
              placeholder="请输入授权码以登录"
              v-model="code"
              @keyup.enter="onVerifyCode"
              :autofocus="true"
            ></el-input>
            <el-button class="flex-1" type="primary" @click="onVerifyCode" :loading="verifyLoading"
              >确定</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<style>
.loginDialog .el-input {
  --el-input-border-radius: 4px 0 0 4px;
}
.loginDialog .el-button {
  --el-border-radius-base: 0 4px 4px 0;
}
body .loginDialog .el-dialog__header {
  display: none;
}
</style>
