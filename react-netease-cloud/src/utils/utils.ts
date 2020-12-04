// 工具函数

// 格式化--万
const formatTenThousand = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(0) + '万'
  }
  return num
}

const utils = {
  formatTenThousand,
}

export default utils
