import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue'
import router from '@/router'
import store from '@/store'
import SvgIcon from '@/components/SvgIcon.vue'


createApp(App).use(router).use(store).use(Antd).component('svg-icon', SvgIcon).mount('#app')
