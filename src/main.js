
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 文本编辑器
import { ElementTiptapPlugin } from 'element-tiptap'
import 'element-tiptap/lib/style.css';

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
app.use(ElementTiptapPlugin, { lang: 'zh' }) // 中文
// app.use(router)
// app.use(pinia)
app.mount('#app')

