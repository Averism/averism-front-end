const path = require('path');
const fs = require('fs');
const {DllReferencePlugin} = require('webpack');

const modules = fs.readdirSync(path.resolve(__dirname, 'src', 'module'))
const modulesPlugin = modules.map(x=>new DllReferencePlugin({
  context: __dirname,
  manifest: path.resolve(__dirname, 'build', 'scripts', "manifests", `module_${x}.json`),
  sourceType: "jsonp"}
  ))

module.exports = {
  entry: {
    index: './src/index.ts'
    },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }],
        exclude: /node_modules/,
      },

      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build', 'scripts'),
    chunkLoading: 'jsonp',
  },
  optimization: {
    minimize: false
  },
  plugins: [...modulesPlugin]
};