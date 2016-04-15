// Karma configuration
// Generated on Fri Mar 11 2016 23:23:43 GMT+0100 (CET)
const defaultConfig = require('./default.conf');

module.exports = function(config) {

    var configuration = Object.assign({}, defaultConfig(config), {

        frameworks: ['benchmark'],

        files: [
          'node_modules/lodash/lodash.js',
          'lib/**/*.js',
          'test/benchmark.js'
        ],

        reporters: ['benchmark'],

        captureTimeout: 20000,
        reportSlowerThan: 500
    });

    config.set(configuration)
}
