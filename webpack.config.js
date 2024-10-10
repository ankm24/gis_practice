const path = require('path');

module.exports = {
    devtool: "source-map",
    entry: ['./public/src/main.js','./public/src/kakaomap.js','./public/src/view.js'],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public', 'javascripts'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
