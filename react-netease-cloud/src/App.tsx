import React, { FC, Suspense } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import LoadingPage from 'components/LoadingPage'
import { BackTop } from 'antd'
import BeforeEach from 'components/BeforeEach'
import { renderRoutes } from 'react-router-config'
import routes from 'config/routes'

const App: FC = () => {
  return (
    <div className="app">
      <Suspense fallback={<LoadingPage text="努力加载中..." />}>
        <Router>
          {/* 路由守卫 */}
          <BeforeEach>
            {/* <Route path='/' component={Home}></Route> */}

            {/* 渲染根路由 */}
            {renderRoutes(routes)}
          </BeforeEach>
        </Router>
      </Suspense>

      {/* 回到顶部 */}
      <BackTop
        visibilityHeight={200}
        style={{ bottom: 100 }}
        target={() => document.querySelector('.app') as HTMLElement}
      >
        <div className="back-to-top">UP</div>
      </BackTop>
    </div>
  )
}

export default App
