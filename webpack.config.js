const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point for the application
  entry: './client/index.jsx',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Development server configuration
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000, // Port for the dev server
    open: true, // Automatically open the browser
    hot: true, // Hot reloading
  },

  // Define how different file types are processed
  module: {
    rules: [
      {
        // Rule for JavaScript/JSX files
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // Rule for CSS files
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      {
        // Rule for image files
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },

  // Plugins used by Webpack
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],

  // Resolve file extensions for import statements
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  // Set the mode to development
  mode: 'development',
};
