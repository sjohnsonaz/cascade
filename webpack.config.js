module.exports = {
    entry: {
        'Graph': './src/modules/Graph.ts',
        'Template': './src/modules/Template.ts',
        'graphTest': './test/ts/graph.ts',
        'cascadeTest': './test/ts/cascade.ts'
    },
    output: {
        filename: './dist/bundle/[name].js',
        libraryTarget: 'var',
        library: '[name]'
    },
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
