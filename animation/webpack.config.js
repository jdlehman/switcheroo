var webpack = require('webpack');
var path = require('path');

module.exports = {
  cache: true,
  target: 'web',
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.js', '.css'],
    modules: ['node_modules', __dirname]
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
