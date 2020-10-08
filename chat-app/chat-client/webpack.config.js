const webpack = require("webpack");
const dotenv = require("dotenv").config();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

const envParsed = dotenv.parsed || { PUBLIC_URL: "" };
const envKeys = Object.keys(envParsed).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(envParsed[next]);
  return prev;
}, {});

var config = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: envParsed.PUBLIC_URL,
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
    config.devServer = {
      inline: true,
      contentBase: "./public",
      watchContentBase: true,
      historyApiFallback: true,
      port: 5051,
    };
    config.output = {
      publicPath: "/",
      filename: "bundle.dev.js",
    };
  }

  if (argv.mode === "production") {
    config.output = {
      publicPath: "/",
      filename: "bundle.min.js",
    };
    optimization = {
      minimize: true,
    };
  }

  return config;
};
