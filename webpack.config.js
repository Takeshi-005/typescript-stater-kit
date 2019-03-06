// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractTextPlugin = new ExtractTextPlugin('css/style.css');
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
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, 'dist/assets/js'),
      publicPath: '/assets/',
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [
        // typescript
        {
          test: /\.tsx?$/,
          use: [
            // !isProduction && {
            //   loader: "babel-loader"
            //   // options: { plugins: ["react-hot-loader/babel"] }
            // },
            "ts-loader"
          ].filter(Boolean),
          exclude: /node_modules/
        },
        {
          test: /\.(sass|scss)$/,
          use: ExtractTextPlugin.extract({
            use: [
              // CSSをバンドルするための機能
              {
                loader: "css-loader",
                options: {
                  url: false, // CSS内のurl()メソッドの取り込みを禁止する
                  minimize: mode, 
                  sourceMap: true,
                  // Sass+PostCSSの場合は2を指定
                  importLoaders: 2
                }
              },
              // PostCSSのための設定
              {
                loader: "postcss-loader",
                options: {
                  sourceMap: true, // PostCSS側でもソースマップを有効にする
                  plugins: [
                    // Autoprefixerを有効化
                    // ベンダープレフィックスを自動付与する
                    require('autoprefixer')({grid: true})
                  ]
                }
              },
              // Sassをバンドルするための機能
              {
                loader: "sass-loader",
                options: {
                  // ソースマップの利用有無
                  sourceMap: true,
                }
              }
            ],
          })
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
      extractTextPlugin,
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
      isProduction && new StatsPlugin('../../../stats.json', {
        chunkModules: true,
      }),
      isProduction && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    performance: {
      maxEntrypointSize: 400000
    }
  }
};
