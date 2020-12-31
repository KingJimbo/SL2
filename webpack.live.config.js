const path = require("path");

module.exports = {
	devtool: "inline-source",
	entry: "./src/index.js",
	mode: "production",
	output: {
		filename: "main.js",
		libraryTarget: "commonjs",
		path: path.resolve(__dirname, "dist"),
	},
	target: "node",
};
