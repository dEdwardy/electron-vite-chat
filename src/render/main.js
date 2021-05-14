import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import 'normalize.css'
import router from '@/router'
import store from '@/store'
import SvgIcon from '@/components/SvgIcon.vue'
import '@/common/public.scss'
import loadPlugin from '@/plugins/antd-vue'
const app = createApp(App)
  .use(router)
  .use(store)
  .component('svg-icon', SvgIcon)

  loadPlugin(app)
  app.mount('#app')
