var webpack = require('webpack');
var path = require('path');

process.env.NODE_ENV = 'production';

module.exports = {
  cache: true,
  target: 'web',
  devtool: 'eval',
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.js', '.css'],
    modules: ['node_modules', __dirname],
    mainFields: ['browser', 'module', 'jsnext:main', 'main']
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
