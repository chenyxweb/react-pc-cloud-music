// 集中管理接口
import homeApi from './homeApi'
import loginApi from './loginApi'
import userApi from './userApi'

// ------------------------- 统一导出 -------------------------
// 根据页面划分api

const http = {
  ...homeApi,
  ...loginApi,
  ...userApi,
}

export default http
