const path = require("path");
//const webpack = require("webpack");

module.exports = {
	entry: "./src/index.js",
	mode: "development",
	output: {
		filename: "main.js",
		libraryTarget: "commonjs",
		path: `C:\\Users\\frase\\AppData\\Local\\Screeps\\scripts\\127_0_0_1___21025\default`,
	},
	// plugins: [
	// 	new webpack.DefinePlugin({
	// 		"process.env.useLogging": false,
	// 	}),
	// ],
	target: "node",
};
