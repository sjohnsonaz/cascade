module.exports = {
    entry: {
        'Cascade': './src/modules/Cascade.ts',
        'Graph': './src/modules/Graph.ts',
        'Template': './src/modules/Template.ts',
        'graphTest': './test/ts/graphTest.ts',
        'cascadeTest': './test/ts/cascadeTest.ts'
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
