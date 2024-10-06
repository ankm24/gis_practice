import path from 'path';

export default {
    mode:'development',
    entry: './javascripts/openlayers.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    devtool: 'source-map',
};