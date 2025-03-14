import './assets/base.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-plus组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//使用element-icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入request
import Request from '@/utils/request.js'
//引入message
import message from '@/utils/message.js'
import VueCookies from 'vue-cookies'
//引入table全局组件
import Table from '@/components/Table/index.vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Table', Table)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.Request = Request
app.config.globalProperties.Message = message
app.config.globalProperties.VueCookies = VueCookies
app.mount('#app')
