const { override, fixBabelImports, addWebpackExternals } = require('customize-cra')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WebpackBar = require('webpackbar')

//生产环境去除console.
const dropConsole = () => (config) => {
  if (process.env.NODE_ENV === 'production') {
    if (config.optimization.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.compress.drop_console = true
        }
      })
    }
  }

  return config
}

// production 配置
const prodConfig = () => (config) => {
  if (config.mode === 'development') {
    console.log('development')
  } else if (config.mode === 'production') {
    console.log('production')
    // 打包gzip配置
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\.css$/,
        threshold: 10 * 1024, // 10k以上开启gzip
      })
    )
  }

  return config
}

// 添加 webpack 进度条
const addWebpackBar = (options) => (config) => {
  config.plugins.push(new WebpackBar(options))

  return config
}

module.exports = {
  webpack: override(
    // antd 按需加载
    fixBabelImports('antd', {
      libraryName: 'antd',
      style: 'css',
    }),

    dropConsole(), // 生产环境去除console

    prodConfig(), // production 配置

    addWebpackBar({ profile: true }), // 添加 webpack bar

    // cdn
    addWebpackExternals(
      process.env.NODE_ENV === 'production'
        ? {
            // 库名 : 变量名
            react: 'React',
            axios: 'axios',
            redux: 'Redux',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM',
            'react-redux': 'ReactRedux',
            'react-transition-group': 'ReactTransitionGroup',
          }
        : {}
    )
  ),
}
