// 集中管理接口
import homeApi from './homeApi'
import loginApi from './loginApi'

// ------------------------- 统一导出 -------------------------
// 根据页面划分api

const http = {
  ...homeApi,
  ...loginApi,
}

export default http
