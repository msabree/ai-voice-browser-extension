const path = require("path");
const Dotenv = require("dotenv-webpack");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: {
        index: "./src/index.tsx",
        contentScript: "./src/contentScript.tsx"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
        ],
    },
    plugins: [
        new Dotenv(),
        new webpack.ProvidePlugin({
            process: 'process/browser', // Make process globally available
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "manifest.json",
                    to: "../manifest.json"
                },
                {
                    from: path.resolve(__dirname, 'public/icons'),
                    to: path.resolve(__dirname, 'dist/icons'),
                }
            ],
        }),
        ...getHtmlPlugins(["index"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            assert: false,
            util: false,
            console: false,
            process: require.resolve('process/browser'),
        },
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}