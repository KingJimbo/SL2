const path = require("path");

module.exports = {
	entry: "./src/index.js",
	mode: "development",
	output: {
		filename: "main.js",
		libraryTarget: "commonjs",
		path: path.resolve(__dirname, "dist"),
	},
	target: "node",
};
