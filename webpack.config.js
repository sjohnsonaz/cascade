var webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        'cascade': ['./src/scripts/modules/Cascade.ts']
    },
    output: {
        filename: './dist/bundle/[name].min.js',
        libraryTarget: 'var',
        library: '[name]'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: ['ts-loader']
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};
