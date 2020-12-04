import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import LoadingPage from 'components/LoadingPage'
import { BackTop } from 'antd'

const Home = lazy(() => import('./pages/Home'))

const App = () => {
  return (
    <div className='app'>
      <Suspense fallback={<LoadingPage text='努力加载中...' />}>
        <Router>
          <Route path='/' component={Home}></Route>
        </Router>
      </Suspense>

      {/* 回到顶部 */}
      <BackTop visibilityHeight={200} target={() => document.querySelector('.app') as HTMLElement}>
        <div className='back-to-top'>UP</div>
      </BackTop>
    </div>
  )
}

export default App
