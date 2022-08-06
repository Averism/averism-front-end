const path = require('path');
const { DllPlugin } = require('webpack');

module.exports = function (entry, exportDll = false, referencePlugins = []) {
  let exportDllPlugin = exportDll ?
    [new DllPlugin({
      context: __dirname,
      name: "[name].js",
      path: path.resolve(__dirname, 'build', 'scripts', 'manifests', '[name].json')
    })] : [];
  return {
    entry,
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
    plugins: [...exportDllPlugin, ...referencePlugins]
  };
}