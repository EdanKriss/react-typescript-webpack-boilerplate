const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env) => {
    // Backend URL
    const API_URL = (env && env.API_HOST) || '';
    // ASSET_PATH determines the path that assets get served from after compile
    // i.e. the path appended to image imports/requires
    // example: if ASSET_PATH equals https://cdn.com/pictures/
    // var kitty = require('relative/path/to/kitty.jpg');
    // then: kitty variable equals https://cdn.com/pictures/{hash}.jpg
    const ASSET_PATH = (env && env.ASSET_PATH) || '/';

    return {
        entry: './src/index.tsx',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'], // modules like Material-UI have typescript declarations, but the modules themselves are js files
            plugins: [new TsconfigPathsPlugin({extensions: ['.tsx', '.ts']})]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader', // https://github.com/TypeStrong/ts-loader
                    exclude: /node_modules/,
                },{
                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                        "sass-loader" // compiles Sass to CSS, using Node Sass ('node-sass') by default (I am using Dart Sass ('sass') instead, as recommended by webpack docs)
                    ]
                },{
                    test: /\.css$/,
                    use: [
                        "style-loader", // creates <style> node in <head> from string
                        "css-loader", // translates CSS into string
                    ]
                },
            ],
        },
        plugins: [
            // This simply replaces variables at compile time, so that the value will be a hard coded value in the bundle.
            // Because it uses direct text replacement in the source file, strings must have quotes added as terminal characters in string (which JSON.stringify does for us).
            // For Nodejs, using dot notation prevents overriding the actual process object
            // For Browser, there is no process object, so we have to use fully qualified variable (process.env.API_URL), which matches behavior of built-in webpack process.env.NODE_ENV
            new webpack.DefinePlugin({
                'process.env.API_URL': JSON.stringify(API_URL),
                'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
            })
        ],
        devServer: {
            historyApiFallback: true,
        },
        // optimization: {
        //     // to debug build in slightly more readable way
        //     minimize: false
        // },
    };
};