const webpack = require('webpack')
const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './example/example.js'),
  output: {
    path: path.resolve(__dirname, '../dist/example'),
    filename: 'example.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    port: 8084,
    host: '127.0.0.1',
    https: false,
    compress: true,
    hot: true
  },
  resolve: {
    modules: ['node_modules']
  },
  plugins: [
    new HtmlwebpackPlugin({
      template: path.resolve(__dirname, './example/example.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
