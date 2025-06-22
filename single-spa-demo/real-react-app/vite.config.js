import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        // React 插件配置
        fastRefresh: !isProduction,
      })
    ],

    // 开发服务器配置
    server: {
      port: 3001,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },

    // 构建配置
    build: {
      // 输出目录
      outDir: 'dist',

      // 清空输出目录
      emptyOutDir: true,

      // 生成 source map
      sourcemap: isProduction ? true : 'inline',

      // 关闭压缩以便调试（可选）
      minify: isProduction ? 'esbuild' : false,

      // Rollup 选项
      rollupOptions: {
        // 外部依赖 - 这些依赖由基座应用提供
        external: [
          'react',
          'react-dom',
          'react-dom/client',
          'single-spa',
          'single-spa-react',
          'react-router-dom'
        ],

        // 输入配置
        input: resolve(__dirname, 'src/index.js'),

        // 输出配置 - 关键：SystemJS 格式
        output: {
          // 输出格式为 SystemJS
          format: 'system',

          // 输出文件名
          entryFileNames: isProduction ? '[name].[hash].js' : 'main.js',

          // 不生成 chunk 文件，保持单一文件输出
          manualChunks: undefined,

          // 全局变量映射（用于外部依赖）
          globals: {
            'react': 'react',
            'react-dom': 'react-dom',
            'react-dom/client': 'react-dom',
            'single-spa': 'single-spa',
            'single-spa-react': 'single-spa-react',
            'react-router-dom': 'react-router-dom'
          }
        }
      },

      // 库模式配置
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        formats: ['system'],
        fileName: (format) => isProduction ? `main.[hash].js` : 'main.js'
      }
    },

    // 依赖优化
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom'
      ]
    },

    // 路径解析
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      }
    },

    // 环境变量
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      // 添加微前端相关的环境变量
      'process.env.MICRO_APP_NAME': JSON.stringify('@company/react-micro-app'),
      'process.env.MICRO_APP_VERSION': JSON.stringify('1.0.0')
    },

    // CSS 配置
    css: {
      modules: {
        // CSS 模块配置
        localsConvention: 'camelCase'
      }
    }
  };
}); 