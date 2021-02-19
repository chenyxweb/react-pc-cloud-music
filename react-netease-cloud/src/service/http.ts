// 集中管理接口
import homeApi from './homeApi'

// ------------------------- 统一导出 -------------------------
// 根据页面划分api

const http = {
  ...homeApi,
}

export default http
