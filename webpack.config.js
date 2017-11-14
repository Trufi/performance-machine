const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');

copyAssets();

module.exports = (env = {}) => {
    const tsCheckerPlugin = new ForkTsCheckerWebpackPlugin({
        watch: ['./viewer', './device'],
    });

    const config = {
        module: {
            rules: [{
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            }],
        },

        resolve: {
            extensions: ['.ts', '.js'],
        },

        entry: {
            viewer: './viewer/index.ts',
            device: './device/index.ts',
        },

        output: {
            filename: '[name]/index.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },

        plugins: [
            tsCheckerPlugin,
        ],
    };

    if (env.production) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
        config.devServer = {
            contentBase: path.resolve(__dirname, 'dist'),
            host: '0.0.0.0',
            port: 3000,
            stats: {
                modules: false,
            },
            disableHostCheck: true,
        };
    }

    return config;
};

function copyAssets() {
    const root = __dirname;
    const dist = path.join(root, 'dist');

    fs.copySync(path.join(root, 'viewer/index.html'), path.join(dist, 'viewer/index.html'));
    fs.copySync(path.join(root, 'device/index.html'), path.join(dist, 'device/index.html'));
}