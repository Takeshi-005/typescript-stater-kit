
const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        common: "./src/js/app.ts"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, 'dist/assets/js')
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
      ]
    }
  };