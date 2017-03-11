	const webpack = require('webpack')
	const path = require('path');

	module.exports = {
		entry: [
			path.resolve(__dirname, 'src/main.js')
		],
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'bundle.js',
		},
		devtool: false,
		module: {
			loaders: [{
				test: /\.js?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
				loader: 'babel-loader' // 加载模块 "babel" 是 "babel-loader" 的缩写
			}]
		}
	};