var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [{
    context: __dirname + "/client",
    entry: {
        bundle: "./app.js"
    },
    output: {
        path: __dirname + "/schedule/frontend/static",
        filename: "js/[name].js"
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    }
    ,
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
