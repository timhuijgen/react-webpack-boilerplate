var
    path    = require('path'),
    webpack = require('webpack');

exports.production = {
    entry: {
    },
    output: {
        publicPath: '/'
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'app')
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            __DEV__: false,
            __DEVTOOLS__: false,
            __CLIENT__: true,
            BASEPATH: JSON.stringify('/')
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};

exports.dev = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server'
    ],
    output: {
        publicPath: '/'
    },
    plugins: [
        new webpack.DefinePlugin({
            // Envify
            'process.env.NODE_ENV': JSON.stringify('development'),
            // GLOBALS
            __DEV__: true,
            __DEVTOOLS__: false,
            __CLIENT__: true,
            BASEPATH: JSON.stringify('/')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel'],
                include: path.join(__dirname, 'app')
            }
        ]
    }
};