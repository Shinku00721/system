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
import Cover from '@/components/cover/index.vue'
import CoverUpload from '@/components/coverupload/index.vue'
import CategorySelect from "@/components/categoryselect/index.vue"
import SunEditor from '@/components/suneditor/index.vue'
import ImportData from '@/components/importdata/index.vue'
import ShowDetail from '@/components/showDetail/index.vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Table', Table)  //表格
app.component("Cover", Cover)  //展示图片
app.component('CoverUpload', CoverUpload) //上传图片
app.component('CategorySelect', CategorySelect) //分类选择
app.component('SunEditor', SunEditor) //富文本编辑器
app.component('ImportData', ImportData)  //批量导入数据
app.component('ShowDetail', ShowDetail)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.Request = Request
app.config.globalProperties.Message = message
app.config.globalProperties.VueCookies = VueCookies
app.mount('#app')
