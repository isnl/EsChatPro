// 随机生成16位uuid
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
// 生成随机字符串
export function randomString(len: number) {
  len = len || 32
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export const getStatusMap = () => {
  const statusMap = [
    {
      label: '私有',
      value: 0
    },
    {
      label: '待审核',
      value: 1
    },
    {
      label: '审核通过',
      value: 2
    },
    {
      label: '审核拒绝',
      value: 3
    }
  ]
  return statusMap
}

export const getStatusTip = (status: 0 | 1 | 2 | 3) => {
  const statusMap = {
    0: {
      text: '私有',
      color: ''
    },
    1: {
      text: '待审核',
      color: 'warning'
    },
    2: {
      text: '审核通过',
      color: 'success'
    },
    3: {
      text: '审核拒绝',
      color: 'danger'
    }
  }
  return statusMap[status]
}

export const isDev = import.meta.env.MODE === 'development'
