var path = require('path');
var webpack = require('webpack');
var functions = require('postcss-functions');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const jQueryPlugin = new webpack.ProvidePlugin({
    _: 'lodash',
    $: 'jquery',
    'jQuery'              : 'jquery',
    'window.jQuery'       : 'jquery',
});

var plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('bundle.css'),
    jQueryPlugin
];

if (process.env.NODE_ENV === 'production') {
    plugins = plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            output: {comments: false},
            test: /bundle\.js?$/
        }),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
        })
    ]);
};

var scssLoader = "css-loader!sass-loader!import-glob-loader";
var cssLoader = "css-loader";
if (process.env.NODE_ENV === 'production') {
    scssLoader = "css-loader?minimize=true!sass-loader!import-glob-loader";
    cssLoader = "css-loader?minimize=true";
}

var config = {
    entry: {
        bundle: path.join(__dirname, 'client/index.js')
    },
    output: {
        path: path.join(__dirname, 'server/data/static/build'),
        publicPath: "/static/build/",
        filename: '[name].js'
    },
    plugins: plugins,
    module: {
        loaders: [
            { test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery' },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract(scssLoader) }, // SASS & CSS FILES
            {test: /\.css/, loader: ExtractTextPlugin.extract(cssLoader)},
            {test: /\.(png|gif)$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000'},
            {test: /\.(pdf|ico|jpg|eot|otf|woff|ttf|mp4|webm)$/, loader: 'file-loader?name=[name]@[hash].[ext]'},
            {test: /\.json$/, loader: 'json-loader'},
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'client'),
                loaders: ['babel']
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        alias: {
            jquery: "jquery/src/jquery",
            '#app': path.join(__dirname, 'client'),
            '#c': path.join(__dirname, 'client/components'),
            '#css': path.join(__dirname, 'client/css'),
            'actions': path.join(__dirname, 'client/actions'),
            'assets': path.join(__dirname, 'client/assets'),
            'components': path.join(__dirname, 'client/components'),
            'constants': path.join(__dirname, 'client/constants'),
            'pages': path.join(__dirname, 'client/pages'),
            'reducers': path.join(__dirname, 'client/reducers'),
            'router': path.join(__dirname, 'client/router'),
            'scenes': path.join(__dirname, 'client/scenes'),
            'utils': path.join(__dirname, 'client/utils'),
            'store': path.join(__dirname, 'client/store'),

        }
    },
    svgo1: {
        multipass: true,
        plugins: [
            // by default enabled
            {mergePaths: false},
            {convertTransform: false},
            {convertShapeToPath: false},
            {cleanupIDs: false},
            {collapseGroups: false},
            {transformsWithOnePath: false},
            {cleanupNumericValues: false},
            {convertPathData: false},
            {moveGroupAttrsToElems: false},
            // by default disabled
            {removeTitle: true},
            {removeDesc: true}
        ]
    },
};

module.exports = config;
