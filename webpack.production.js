const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.config");
const path = require("path");

module.exports = merge(base, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/src/index.html"),
      filename: "index.html",
      base: "app://rse",
      chunks: ["home"],
    }),
    new HtmlWebpackPlugin({
      filename: "modal.html",
      template: "app/src/modal/index.html",
      base: "app://rse",
      chunks: ["modal"],
    }),
    new HtmlWebpackPlugin({
      filename:"loading.html",
      template: "app/src/loading/index.html",
      base: "app://rse",
      chunks: ["loading"]
    })

    // You can paste your CSP in this website https://csp-evaluator.withgoogle.com/
    // for it to give you suggestions on how strong your CSP is
  ],
  optimization: {
    minimize: true,
    minimizer: [
      "...", // This adds default minimizers to webpack. For JS, Terser is used. // https://webpack.js.org/configuration/optimization/#optimizationminimizer
      new CssMinimizerPlugin(),
    ],
  },
});
