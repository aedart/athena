'use strict';

// Obtain presets from file
const fs = require('fs');
let content = fs.readFileSync('.babelrc');
let babel = JSON.parse(content);

console.info('Babel presets', JSON.stringify(babel.presets));

// Webpack configuration
module.exports = {
    // output: {
    //     filename: 'bundle.js'
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                ],
                loader: "babel-loader",
                options: {
                    presets : babel.presets
                }
            }
        ]
    }
};
