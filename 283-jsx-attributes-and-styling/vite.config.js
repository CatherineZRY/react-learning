import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 自定义静态资源目录
  publicDir: 'public',
  // 或者配置基础路径
  base: '/my-app/'
})
