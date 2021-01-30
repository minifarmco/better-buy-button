const path = require('path');
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            { test: /\.(js|ts|tsx?)$/, loader: "ts-loader" },
            {
                test: /\.svg$/,
                use: [
                  {
                    loader: 'svg-url-loader',
                    options: {
                      limit: 10000,
                    },
                  },
                ],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {moment: `moment/moment.js`}
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
    ],
    optimization : {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              output: {
                // removing comments
                comments: false,
              },
              compress: {
                // remove console.logs
                drop_console: true,
              },
            },
          }),
        ],
      },
    target: 'web'
};

module.exports = [
    {
        ...baseConfig,
        entry: './src/pages/cart-header/index.tsx',
        output: {
            ...baseConfig.output,
            filename: 'minifarm-cart-header.js',
            library: 'MiniFarmCartHeader',
        },
    },
    {
        ...baseConfig,
        entry: './src/pages/buy-button/index.tsx',
        output: {
            ...baseConfig.output,
            filename: 'minifarm-shopifybuy-button.js',
            library: 'MiniFarmShopifyBuyButton',
        },
    },
    {
        ...baseConfig,
        entry: './src/pages/cart-body/index.tsx',
        output: {
            ...baseConfig.output,
            filename: 'minifarm-cart-body.js',
            library: 'MiniFarmCartBody',
        },
    }
];
