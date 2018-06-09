var webpackConfig = require('./webpack.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'spec.bundle.js'
    ],
    exclude: [],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-spec-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-webpack")
    ],
    preprocessors: {
      'spec.bundle.js': ['webpack', 'sourcemap']
    },
    webpack: {
      resolve: {
        extensions: ['.js', '.ts', '.json'],
      },
      devtool: 'inline-source-map',
      module: {

        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true
            }
          },
          {
            test: /\.html$/,
            exclude: /node_modules/,
            loader: 'raw-loader'
          },
          {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                  camelCase: true
                }
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
          {
            test: /\.css$/,
            include: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader"
            ]
          },
          // Loading glyphicons => https://github.com/gowravshekar/bootstrap-webpack
          // Using here url-loader and file-loader
          {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          },
          {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
          },
          {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader'
          },
          {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
          },
        ],
      }
    },
    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  });
};
