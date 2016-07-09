var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [{
  context: __dirname+ "/client",
  entry: {
    bundle: "./app.js"
  },
  output: {
    path: __dirname + "/schedule/static",
    filename: "js/[name].js"
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader")
    }, {
      test: /\.sass$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
    }],
  },
  plugins: [
    new ExtractTextPlugin("css/[name].css"),
  ]
}];
