const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: argv.mode || 'development',
    entry: './src/index.js',

    // 开发服务器配置
    devServer: {
      port: 3001,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      // 在开发环境中也使用 SystemJS 格式
      devMiddleware: {
        writeToDisk: true,
      },
    },

    // 关键配置：输出为 SystemJS 格式
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'system',  // 输出 SystemJS 格式
      clean: true,
      // 生产环境使用内容哈希
      filename: isProduction ? '[name].[contenthash].js' : 'main.js',
    },

    // 外部依赖配置 - 这些依赖由基座应用提供
    externals: {
      'react': 'react',
      'react-dom': 'react-dom',
      'single-spa': 'single-spa',
      'single-spa-react': 'single-spa-react'
    },

    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },

    module: {
      rules: [
        // JavaScript/JSX 处理
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['last 2 versions', 'ie >= 11']
                  }
                }],
                '@babel/preset-react'
              ]
            }
          }
        },

        // CSS 处理
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },

        // 图片和字体处理
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[hash][ext]'
          }
        }
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),

      // 开发环境需要 HTML 文件用于独立开发
      !isProduction && new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: false, // 不自动注入脚本，因为我们使用 SystemJS
        templateContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>React 微应用 - 独立开发模式</title>
              <script type="systemjs-importmap">
                {
                  "imports": {
                    "react": "https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js",
                    "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js",
                    "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5/lib/system/single-spa.min.js",
                    "single-spa-react": "https://cdn.jsdelivr.net/npm/single-spa-react@5/lib/system/single-spa-react.min.js"
                  }
                }
              </script>
              <script src="https://cdn.jsdelivr.net/npm/systemjs@6/dist/system.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              <script>
                System.import('./main.js').then(app => {
                  // 独立开发模式下直接挂载应用
                  app.bootstrap().then(() => {
                    app.mount({
                      domElement: document.getElementById('root'),
                      name: '@company/react-micro-app'
                    });
                  });
                });
              </script>
            </body>
          </html>
        `
      })
    ].filter(Boolean),

    // 开发工具
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // 优化配置
    optimization: {
      minimize: isProduction,
      // 不分割代码块，保持单一文件输出
      splitChunks: false,
    }
  };
}; 