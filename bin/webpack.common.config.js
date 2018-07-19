const webpack           = require('webpack');
const ProgressBarPlugin = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const configCache = {};

module.exports = function(PATHS, currentEnv) {

  console.log("[WebpackCommonConfig] Using config for "+currentEnv);

  // Load cached config
  if(configCache[currentEnv] !== undefined) {
    return configCache[currentEnv];
  }

  const buildConfig = require('../buildConfig.js')[currentEnv];

  if(currentEnv === 'prod' || currentEnv === 'lib') {
    buildConfig['process.env'] = {
      NODE_ENV: JSON.stringify('production')
    };
  }
  
  let webpackDevtool = false;
  
  let webpackPlugins = [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin(buildConfig)
  ];
  
  let webpackLoaders = [
    {
      test: /\.css|\.less$/,
      loaders: [
        'style-loader?sourceMap',
        'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
        'less-loader'
      ]
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }
  ];
  
  let webpackEntry = [
    PATHS.srcAppEntry
  ];

  let webpackTarget = undefined;
  let webpackAliases = {};
  let webpackOutput = {};
  let webpackExternals = {};
  
  if(currentEnv === 'prod') {
      webpackOutput = {
          filename: 'bundle.js',
          sourceMapFilename: '[file].map',
          path: PATHS.outAppEntry
      };
  } else if(currentEnv === 'lib') {
      webpackOutput = {
          filename: PATHS.outLibName,
          sourceMapFilename: '[file].map',
          path: PATHS.outLibEntry,
          library: '',
          libraryTarget: 'commonjs',
          //umdNamedDefine: true
      };
      webpackEntry = [
          PATHS.srcLibEntry
      ];
      webpackExternals = {
          react: {
              root: 'React',
              commonjs2: 'react',
              commonjs: 'react',
              amd: 'react',
              umd: 'react'
          },
          'react-dom': {
              root: 'ReactDOM',
              commonjs2: 'react-dom',
              commonjs: 'react-dom',
              amd: 'react-dom',
              umd: 'react-dom'
          }
      };
      webpackTarget = 'node';
  } else if(currentEnv === 'dev') {
    webpackOutput = {
      filename: 'bundle.js',
      path: PATHS.outAppEntry
    };
  } else {
    webpackOutput = {
      filename: 'bundle.js',
      path: PATHS.outAppEntry
    };
  }
  
  if(currentEnv === 'prod' || currentEnv === 'lib') {
    
    webpackDevtool = 'source-map';
    
    webpackEntry = webpackEntry.concat([

    ]);
    
    webpackLoaders = webpackLoaders.concat([
      {
        test: /\.jsx|js?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                "env", "react", "react-optimize"
              ],
              plugins: [
                ["react-css-modules", {}]
              ]
            }
          },
          //{ loader: 'eslint-loader' }
        ]
      }
    ]);
    
    webpackPlugins = webpackPlugins.concat([
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      }),
      new webpack.optimize.AggressiveMergingPlugin()
    ]);
  } else if(currentEnv === 'dev') {
    
    webpackDevtool = 'eval';
    
    webpackEntry = webpackEntry.concat([
      'babel-polyfill'
    ]);
    
    webpackLoaders = webpackLoaders.concat([
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: 'babel-loader',
          options: {
              cacheDirectory: true,
              presets: [
                "env", "react"
              ],
              plugins: [
                ["react-css-modules", {}]
              ]
          }
        }
      ]
    }
    ]);
    
    webpackPlugins = webpackPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
      //new webpack.NoErrorsPlugin()
    ]);
  }

  if(currentEnv != 'lib') {
      webpackPlugins = webpackPlugins.concat([
          new HtmlWebpackPlugin()
      ]);
  }

  // Final webpack config
  const finalConfig = {
    target: webpackTarget,
    mode: (currentEnv == 'dev')?'development':'production',
    entry: webpackEntry,
    stats: {
      colors: true,
      reasons: true
    },
    output: webpackOutput,
    module: {
      rules: webpackLoaders
    },
    plugins: webpackPlugins,
    node: {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    externals: Object.assign({
      fs: '{}',
      tls: '{}',
      net: '{}',
      console: '{}'
    }, webpackExternals),
    resolve: {
      alias: webpackAliases,
      extensions: ['.js', '.jsx', 'index.js', 'index.jsx', '.json']
    }
  };
  
  // Store config in cache
  configCache[currentEnv] = finalConfig;
  
  // Return generated config object
  return finalConfig;
};