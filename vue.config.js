var webpack = require('webpack');
module.exports = {
  devServer: {
    proxy: {
      '/console': {
        target: 'http://localhost:9210',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/console': ''
        }
      }
    }
  },
  publicPath: './',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
      }),
    ]
  }
}