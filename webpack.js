const path = require('path');
const { DllPlugin, DllReferencePlugin } = require('webpack');

module.exports = function (entry, exportDll = false, externalDependencies = []) {
  let exportDllPlugin = exportDll ?[new DllPlugin({
      context: __dirname,
      name: "[name].js",
      path: path.resolve(__dirname, 'build', 'scripts', 'manifests', '[name].json'),
      type: "window"})] : [];
  const referencePlugins = externalDependencies.map(x => new DllReferencePlugin({
    manifest: path.resolve(__dirname,  'build', 'scripts', "manifests", `${x}.json`),
    sourceType: "window",
  }));
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
      library: {
        name: '[name].js',
        type: 'window'
      }
    },
    optimization: {
      minimize: false
    },
    plugins: [...exportDllPlugin, ...referencePlugins],
    externals: [
      function ({ context, request }, callback) {
        if(context == __dirname) return callback()
        console.log("EXTERNALS CONTEXT",context);
        console.log("EXTERNALS REQUEST",request);
        if (/^yourregex$/.test(request)) {
          // Externalize to a commonjs module using the request path
          return callback(null, 'commonjs ' + request);
        }
  
        // Continue without externalizing the import
        callback();
      },
    ],
  };
}