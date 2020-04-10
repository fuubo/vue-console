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
  publicPath: './'
}