/*
axios: HTTP 클라이언트
react-addons-update: Immutability Helper (Redux 의 store 값을 변경 할 때 사용)
react-router: 클라이언트사이드 라우터
react-timeago: 3 seconds ago, 3 minutes ago 이런식으로 시간을 계산해서 몇분전인지 나타내주는 React 컴포넌트
redux, react-redux; FLUX 구현체 및뷰 레이어 바인딩
redux-thunk: redux의 action creator에서 함수를 반환 할 수 있게 해주는 redux 미들웨어. 비동기작업 처리 시 사용.
Promise 는 구버전의 브라우저에서 지원하지 않으므로 (링크) babel-polyfill (ES6 기능들을 호환시켜줌) 을 통하여 이를 호환.
*/

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/index.js',
        './src/style.css'
    ],

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel?' + JSON.stringify({
                cacheDirectory: true,
                presets: ['es2015', 'react']
            })],
            exclude: /node_modules/,
        }, {
            test: /\.css$/,
            loader: 'style!css-loader'
        }]
    },

    resolve: {
        root: path.resolve('./src')
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        })
    ]

};
