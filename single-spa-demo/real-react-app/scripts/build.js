#!/usr/bin/env node

import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

async function buildApp() {
  console.log('🚀 开始构建 React 微应用 (Vite + SystemJS)');
  console.log('📁 项目根目录:', root);

  try {
    // 构建生产版本
    console.log('\n📦 构建生产版本...');
    const prodResult = await build({
      root,
      mode: 'production',
      logLevel: 'info'
    });

    console.log('✅ 生产版本构建完成');

    // 构建开发版本（可选）
    console.log('\n📦 构建开发版本...');
    const devResult = await build({
      root,
      mode: 'development',
      logLevel: 'info',
      build: {
        outDir: 'dist-dev',
        minify: false,
        sourcemap: true
      }
    });

    console.log('✅ 开发版本构建完成');

    // 输出构建信息
    console.log('\n📊 构建统计:');
    console.log('- 生产版本: dist/');
    console.log('- 开发版本: dist-dev/');
    console.log('- 输出格式: SystemJS');
    console.log('- 构建工具: Vite');

    console.log('\n🎉 所有构建任务完成！');

  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  buildApp();
}

export { buildApp }; 