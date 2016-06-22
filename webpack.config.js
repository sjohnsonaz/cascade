module.exports = {
    entry: {
        'graphTest': './src/test/ts/graphTest.ts',
        'cascadeTest': './src/test/ts/cascadeTest.ts'
    },
    output: {
        filename: './dist/bundle/[name].js',
        libraryTarget: 'var',
        library: '[name]'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    }
};
