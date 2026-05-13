const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, 

  devServer: {
    proxy: {
      // 1. 当你的请求路径以 /api 开头时，才触发代理
      '/api': {
        target: 'https://openapi.zhihu.com', // 👈 后端真实接口地址
        changeOrigin: true, // 开启跨域
        pathRewrite: {
          '^/api': '' // 把 /api 替换为空（可选，看后端需求）
        }
      }
    }
  }
})
