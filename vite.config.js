import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { SvgBuilder } from './src/render/plugins/SvgBuilder'
import ViteComponents from 'vite-plugin-components'
import styleImport from 'vite-plugin-style-import'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteComponents(),
    SvgBuilder('./src/render/icons/svg/'), // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          }
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/render')
    }
  }
})
