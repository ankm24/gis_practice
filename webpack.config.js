const path = require('path');

module.exports = {
    devtool: "source-map",
    entry: ['./src/main.js', './src/kakaomap.js', './src/view.js'],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public', 'javascripts'),
    }
};
