const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const rootDir = path.resolve(__dirname, '..');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  const baseConfig = {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(rootDir, 'dist/client'),
      filename: 'main.js',
    },
    resolve: {
      modules: ['node_modules', path.resolve(rootDir, 'src')],
      extensions: ['.ts', '.js', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          use: 'babel-loader',
          exclude: '/node_modules/',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
        scriptLoading: 'defer',
      }),
      new ForkTsCheckerWebpackPlugin({}),
    ],
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };

  // 只在生产模式下添加 CleanWebpackPlugin
  if (!isDevelopment) {
    baseConfig.plugins.push(new CleanWebpackPlugin());
  }

  // 只在开发模式下添加 devServer 配置
  if (isDevelopment) {
    baseConfig.devServer = {
      static: path.resolve(rootDir, 'src'),
      compress: true,
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    };
  }

  return baseConfig;
};
