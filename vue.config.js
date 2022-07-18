const Webpack = require('webpack');

module.exports = {
  // generate sourceMap for production build?
  productionSourceMap: true,

  configureWebpack: {
    plugins: [
      new Webpack.DefinePlugin({
        'process.env.GIT_VERSION': JSON.stringify(require('./package.json').version),
      }),
    ]
  },
}