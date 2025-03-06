import './assets/base.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-plus组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入request
import Request from '@/utils/request.js'
//引入message
import message from '@/utils/message.js'
import VueCookies from 'vue-cookies'
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.Request = Request
app.config.globalProperties.Message = message
app.config.globalProperties.VueCookies = VueCookies
app.mount('#app')
