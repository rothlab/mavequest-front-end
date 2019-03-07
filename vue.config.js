const GitRevisionPlugin = require('git-revision-webpack-plugin');
const Webpack = require('webpack');
const SentryPlugin = require('@sentry/webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
  versionCommand: 'describe --tag --long'
});

module.exports = {
  // generate sourceMap for production build?
  productionSourceMap: true,

  configureWebpack: {
    plugins: [
      new Webpack.DefinePlugin({
        'process.env.GIT_VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'process.env.GIT_COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash())
      }),
      new SentryPlugin({
        include: './dist',
        ignore: ['node_modules', 'webpack.config.js'],
        dryRun: process.env.NODE_ENV === 'development'
      }),
    ]
  },
}