const GitRevisionPlugin = require('git-revision-webpack-plugin');
const Webpack = require('webpack');
const gitRevisionPlugin = new GitRevisionPlugin({
  versionCommand: 'describe --tag --long'
});

module.exports = {
  configureWebpack: {
    plugins: [
      new Webpack.DefinePlugin({
        'process.env.GIT_VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'process.env.GIT_COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash())
      })
    ]
  },
  productionSourceMap: false
}