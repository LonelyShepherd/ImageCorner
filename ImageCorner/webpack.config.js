const path = require('path');

module.exports = {
  entry: './src/js/external.js',
  output: {
      path: path.resolve(__dirname, 'assets/js'),
      filename: 'external.bundle.js'
  },
  mode: 'production',
  module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['babel-preset-env']
	        }
	      }
	    }
	  ]
	}
};