const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  entry: './src/player.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'player.bundle.js',
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['env']
      }
    },
    {
      test: /\.(mp3)$/,
      use: 'file-loader?name=images/[name].[ext]'
    },

  ],
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'src/index.html',
      filename: 'index.html'
    })
  ]
}