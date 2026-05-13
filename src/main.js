
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';

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

// const url = window.location.href
const app_id="271";
const app_key="04354c9a62dc4486b0c7fcd0a2b0e49e";

checkLogin(); 

function checkLogin() {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('authorization_code')
    if(!code) {
      window.location.href=`https://openapi.zhihu.com/authorize?redirect_uri=${window.WEB_URL}&app_id=${app_id}&response_type=code`
    } else {
      getAccessToken(code);
      app.mount('#app')
    }
  } catch {

  }
}

async function getAccessToken(code) {
  try {
    const response = await axios.post(`${window.OPEN_API}/access_token`, {
      app_id: app_id,
      app_key: app_key,
      grant_type: 'authorization_code',
      redirect_uri: window.WEB_URL,
      code: code
    });

    const data = response.data;
    if (data) {
      window.ACCESS_TOKEN = data.access_token;
    }
  } catch (error) {
    console.log(error);
  } finally {
    
  }
}


