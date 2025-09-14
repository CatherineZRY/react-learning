import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // base: '/chat-app/', // 当放置目录不是根目录是需要设置
  // 插件配置
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    proxy: {
      // 配置接口调用的代理服务器（正向代理）
      // '/api': 'http://localhost:5001'
    }
  },
  build: {
    outDir: 'dist', // build的输出目录
    chunkSizeWarningLimit: 1000, // 一个chunk文件的最大大小，超过这个大小会警告
    sourcemap: true, // 生成sourcemap文件
    minify: false, // 压缩代码
    rollupOptions: {
      output: {
        format: 'es',
      }
    }
  }

})
