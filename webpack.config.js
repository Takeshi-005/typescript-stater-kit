// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const extractTextPlugin = new ExtractTextPlugin('css/style.css');
const webpack = require('webpack');
const StatsPlugin = require('stats-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  // development に設定するとソースマップ有効でJSファイルが出力される
  const mode = argv.mode === 'production' ? true : false;
  return {
    // server設定
    devServer: {
      // Document Root
      contentBase: path.resolve(__dirname, './dist'),
      watchContentBase: true,
      // port設定
      port: 8000
    },
    // mode,
    // devtool: "inline-source-map",
    entry: {
      common: "./src/js/app.ts"
    },
    optimization: {
      minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, 'dist/assets/js'),
      publicPath: '/assets/',
    },
    // chunk設定
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendorModules: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "client_vendors",
                    chunks: "initial",
                    reuseExistingChunk: true,
                }
            }
        }
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        modules: [path.resolve("resources/js"), "node_modules"]

    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: require.resolve('babel-loader'),
          exclude: /node_modules/,
          options: {
            customize: require.resolve(
              'babel-preset-react-app/webpack-overrides',
            ),
            // plugins: [
            //   [
            //     require.resolve('babel-plugin-named-asset-import'),
            //     {
            //       loaderMap: {
            //         svg: {
            //           ReactComponent: '@svgr/webpack?-svgo![path]',
            //         },
            //       },
            //     },
            //   ],
            // ],
            cacheDirectory: true,
            cacheCompression: mode,
            compact: mode,
          },
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", 'postcss-loader']
        },
        {
            test: /\.(sass|scss)$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: process.env.NODE_ENV === 'development',
                },
              },
              'css-loader',
              'postcss-loader',
              "sass-loader",
            ]
        },
        // 画像の処理について
        {
          // 対象となるファイルの拡張子
          test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
          // 画像を埋め込まず任意のフォルダに保存する
          loader: 'file-loader',
          options: {
            name: 'dist/assts/images/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({filename: '../css/[name].css'}),
      new ForkTsCheckerWebpackPlugin({
      async: false,
      checkSyntacticErrors: true,
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      reportFiles: [
          '**',
          '!**/*.json',
          '!**/__tests__/**',
          '!**/?(*.)(spec|test).*',
          '!**/src/setupProxy.*',
          '!**/src/setupTests.*',
      ],
      watch: path.resolve(__dirname, "resources/js"),
      silent: true,
      // formatter: typescriptFormatter,
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
      mode && new StatsPlugin('../../../stats.json', {
        chunkModules: true,
      }),
      mode && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    performance: {
      maxEntrypointSize: 400000
    }
  }
};
