var path = require('path');
var webpack = require('webpack');

module.exports = {

  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.styl'],
  },

  entry: path.join(__dirname, 'js/app.js'),

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [ path.join(__dirname, 'js') ]
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader',
        include: [ path.join(__dirname, 'stylus') ]
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader'
      },
    ]
  }

};
