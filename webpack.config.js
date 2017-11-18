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
                test: /(\.ts|\.tsx)$/,
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
            extensions: ['.ts', '.js', '.tsx'],
        },

        entry: {
            viewer: './viewer/index.tsx',
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

        devtool: 'source-map',
    };

    return config;
};

function copyAssets() {
    const root = __dirname;
    const dist = path.join(root, 'dist');

    fs.copySync(path.join(root, 'viewer/index.html'), path.join(dist, 'viewer/index.html'));
    fs.copySync(path.join(root, 'device/index.html'), path.join(dist, 'device/index.html'));
}