// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const extractTextPlugin = new ExtractTextPlugin('css/style.css');
const webpack = require('webpack');
const StatsPlugin = require('stats-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');


module.exports = (env, argv) => {
  // development に設定するとソースマップ有効でJSファイルが出力される
  const mode = argv.mode === 'production' ? true : false;
  return {
    entry: {
      app: ["./src/js/app.ts"],
      style: ["./src/scss/style.ts"]
    },
    optimization: {
      minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    output: {
      filename: "[name].js",
      path: `${outputPath}/js`,
      // publicPath: '/js',
    },
    // chunk設定
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendorModules: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "initial",
                    reuseExistingChunk: true,
                }
            }
        }
    },
    // server設定
    devServer: {
      // Document Root
      contentBase: outputPath,
      watchContentBase: true,
      publicPath: '/js/',
      // inline: true,
      // port設定
      port: 8000,
      hot: true,
      overlay: { // エラーまたは警告が発生したときに、ブラウザに全画面overlayを表示する
        warnings: true,
        errors: true
      }
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        modules: [path.resolve("src/js"), "node_modules"]

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
            plugins: [
              "@babel/plugin-proposal-nullish-coalescing-operator",
              "@babel/plugin-proposal-optional-chaining",
            ],
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
              // {
              //   loader: MiniCssExtractPlugin.loader,
              //   options: {
              //     hmr: process.env.NODE_ENV === 'development',
              //   },
              // },
              'style-loader',
              'css-loader',
              { loader: 'postcss-loader',
                options: {
                  plugins: [
                    require('autoprefixer'),
                  ]
                }
              },
              "sass-loader",
              // 共通ファイルmixin,variableなど
              // {
              //   loader: 'sass-resources-loader',
              //   options: {
              //     sourceMap: true,
              //     resources:[
              //       path.resolve(__dirname, 'src/style/_include/*.scss')
              //     ]
              //   }
              // }
            ]
        },
        // 画像の処理について
        {
          // 対象となるファイルの拡張子
          test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
          // 画像を埋め込まず任意のフォルダに保存する
          loader: 'file-loader',
          options: {
            name: 'public/assts/images/[name].[ext]'
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
