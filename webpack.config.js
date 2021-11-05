const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
   filename: 'bundle.js',
   path: path.resolve(__dirname, 'dist'),
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
    ],
  },
};