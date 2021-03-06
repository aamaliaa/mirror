var path = require('path');
var webpack = require('webpack');

const SRC_DIR = path.resolve(__dirname, 'js');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

module.exports = {

  entry: SRC_DIR + '/index.js',

  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },

  target: 'electron-renderer',

  node: {
     __dirname: true
   },

  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.styl'],
    symlinks: true,
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
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|png|svg)(\?.*$|$)/,
        loader: 'url-loader'
      },
    ]
  },

  externals: {
    googleapis: 'commonjs googleapis',
    'google-auth-library': 'commonjs google-auth-library',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  stats: {
    colors: true,
    chunks: false,
    children: false,
  },

};
