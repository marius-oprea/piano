const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index:{
      import: './src/main.js',
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },    
  },  
  module: {  
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: false,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }      
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: "./index.html"
    })
  ]  
};