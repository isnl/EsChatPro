import { h } from 'vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import { ElLink, ElMessage, ElMessageBox } from 'element-plus'
import { copy } from './useCopy'
import service from '@/service'
import { isDev } from '@/utils'

/**
 * 分享
 */
export const onShare = () => {
  const chatStore = useChatStore()
  const { currentMessage, currentRecord } = storeToRefs(chatStore)
  const vTitleNode = h('p', null, [
    h('h3', { class: 'font-500' }, `标题：${currentRecord.value!.name}`),
    h(
      'p',
      null,
      '将当前对话记录以链接的形式分享给其他人，分享后会生成一个访问密码，访问者需要输入正确的访问密码即可查看'
    ),
    h('p', null, '对话记录内容应遵循国内法律法规')
  ])
  ElMessageBox.confirm(vTitleNode, `分享须知：`, {
    confirmButtonText: '确认分享',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const url = 'user/share'
      const params = {
        title: currentRecord.value!.name,
        content: currentMessage.value!.history
      }
      const res: any = await service.post(url, params)
      const { id, password } = res

      const href = `${location.href}share/${id}`
      const vNode = h('div', { class: 'w-full flex flex-col' }, [
        h('div', null, [
          h('span', null, '链接：'),
          h(ElLink, { href, target: '_blank' }, [h('span', null, `${href}`)])
        ]),
        h('span', null, `密码：${password}`)
      ])
      ElMessageBox.alert(vNode, '分享成功', {
        confirmButtonText: '复制全部',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: (action, instance, done) => {
          if (action !== 'confirm') {
            done()
          } else {
            ElMessage.success('复制成功')
            copy(
              `我在Easy Chat上创建了一个AI对话分享，快来看看吧！\n\n「${
                currentRecord.value!.name
              }」\n\n链接：${href}\n\n密码：${password}`
            )
          }
        }
      })
    })
    .catch(() => {})
}
