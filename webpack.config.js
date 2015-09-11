var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  resolve: {
    extensions: ['', '.js', '.jsx', '.styl'],
    modulesDirectories: ['node_modules']
  },

  entry: path.join(__dirname, 'js/app.jsx'),

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'javascripts/[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'jsx-loader'
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css')
  ]

};
