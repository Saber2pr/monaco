const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

const publicPath = (resourcePath, context) =>
  path.relative(path.dirname(resourcePath), context) + '/'

// 这里写cdn地址，如果静态资源有上传的话
const cdn = '/'

/**
 * @type {webpack.Configuration}
 */
module.exports = {
  entry: {
    backend: path.join(__dirname, '../../lib/react/devtools/install-sandbox-wall/index.js'),
    'backend.dev': path.join(__dirname, '../../lib/react/devtools/install-sandbox-wall/index.dev.js'),
    app: './src/app.tsx',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    filename: '[name].min.js',
    path: path.join(__dirname, 'build'),
    publicPath:
      process.env.NODE_ENV === 'production' ? cdn : '/',
    libraryTarget: 'window',
    library: '[name]',
  },
  /**
   * @type {webpackDevServer.Configuration}
   */
  devServer: {
    // 本地调试跨域代理
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000', // 这里写你后端的api地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  module: {
    rules: [
      // 使用babel编译js、jsx、ts、tsx
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: ['babel-loader'],
      },
      // 图片url处理
      {
        test: /\.(woff|svg|eot|ttf|png)$/,
        use: ['url-loader'],
      },
      // css、less编译
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath },
          },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // index.html模板设置
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'template.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: 'style.[id][hash].css',
    }),
    // webpack编译进度
    new webpack.ProgressPlugin(),
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/,
  }
}
