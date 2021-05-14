import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { SvgBuilder } from './src/render/plugins/SvgBuilder'
import styleImport from 'vite-plugin-style-import'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          },
        },
      ],
    }),
    SvgBuilder('./src/render/icons/svg/'), // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/render'),
    },
  },
})
