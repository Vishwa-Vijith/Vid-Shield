const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    "content-scripts/content": "./src/content-scripts/content.js",
    "content-scripts/pages/watchPage":
      "./src/content-scripts/pages/watchPage.js",
    "service-worker/service-worker": "./src/service-worker/service-worker.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: "manifest.json",
        },
        {
          from: "public/icons",
          to: "icons",
        },
        {
          from: "src/service-worker/ml-model",
          to: "service-worker/ml-model",
        },
        { from: "src/popup/index.html", to: "popup/index.html" },
      ],
    }),
  ],
  resolve: {
    extensions: [".js"],
  },
};
