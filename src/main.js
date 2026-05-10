// 1. 引入Element Plus核心和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 2. 引入Element Plus图标（本方案交互需用到图标，如麦克风、复制等）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 3. 创建Vue应用并使用Element Plus
import { createApp } from 'vue'
import App from './App.vue'
// import router from './router' 
// import pinia from './store' 

const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局使用Element Plus、路由、Pinia
app.use(ElementPlus)
// app.use(router)
// app.use(pinia)
app.mount('#app')

