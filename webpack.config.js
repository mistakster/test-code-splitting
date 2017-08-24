const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './src/index.js'
	},

	output: {
		path: path.resolve(__dirname, '_'),
		filename: '[name].js',
		chunkFilename: 'chunk.[chunkhash].js',
		publicPath: ''
	},

	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					plugins: [
						['syntax-dynamic-import']
					],
					presets: ['es2015', 'react']
				}
			}
		}]
	},

	resolve: {
		modules: [
			'node_modules'
		],
		extensions: [
			'.js', '.jsx'
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			minChunks: module => (
				module.context &&
				module.context.indexOf('node_modules') !== -1
			),
			async: 'vendor'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			minChunks: module => (
				module.context &&
				module.context.indexOf('jquery') !== -1
			),
			async: 'jquery'
		})
	]
};
