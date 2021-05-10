import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { SvgBuilder } from './src/render/plugins/SvgBuilder'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SvgBuilder('./src/render/icons/svg/') // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
  ],
  resolve:{
    alias: {
      '@': resolve(__dirname, 'src/render'),
    },
  }
})
