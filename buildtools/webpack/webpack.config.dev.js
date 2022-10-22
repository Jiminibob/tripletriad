const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const SRC = path.resolve(__dirname, "../../src");
const OUTPUT = path.resolve(__dirname, "../../dist");

module.exports = {
  mode: "development",
  entry: path.resolve(SRC, "index.js"),
  output: {
    filename: "index.js",
    path: OUTPUT,
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      }
    ]
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Triple Triad",
      template: path.resolve(SRC, "index.html")
    })
  ],
  devServer: {
    hot: true,
    port: 3000,
    open: true,
    client: {
      logging: "warn"
    },
    static: {
      directory: "./src"
    },
    compress: true
  }
};
