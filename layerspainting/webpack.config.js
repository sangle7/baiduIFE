const webpack = require('webpack')
const path = require('path');

module.exports = {
	entry: {
		app: ["./src/main.js"]
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: "/build/",
	},
	devServer: {
		historyApiFallback: true,
		inline: true, //注意：不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些
	},
	devtool: false,
	module: {
		loaders: [{
			test: /\.js?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
			loader: 'babel-loader' // 加载模块 "babel" 是 "babel-loader" 的缩写
		}, {
			test: /\.css?$/,
			loader: 'style-loader!css-loader'
		}, {
			test: /\.(png|jpg)$/,
			loader: 'url-loader?limit=25000'
		}]
	}
};