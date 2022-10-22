const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const SRC = path.resolve(__dirname, "../../src");
const OUTPUT = path.resolve(__dirname, "../../dist");

module.exports = {
  mode: "production",
  entry: path.resolve(SRC, "index.js"),
  output: {
    filename: "index.min.js",
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
      },
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        use: [
          {
            loader: "img-optimize-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Triple Triad",
      template: path.resolve(SRC, "index.html")
    }),
    new CleanWebpackPlugin({
      root: OUTPUT
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(SRC, "assets"), to: path.resolve(OUTPUT, "assets") }]
    })
  ]
};
