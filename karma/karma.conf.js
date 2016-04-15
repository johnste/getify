// Karma configuration
// Generated on Fri Mar 11 2016 23:23:43 GMT+0100 (CET)
const defaultConfig = require('./default.conf');

module.exports = function(config) {
    var configuration = Object.assign({}, defaultConfig(config), {

        frameworks: ['mocha', 'chai'],

        files: [
          'lib/**/*.js',
          'test/**/*.spec.js'
        ],
        reporters: ['progress']
        // preprocessors: {
        //     'lib/**/*.js': ['coverage']
        // },

        // reporters: ['progress', 'coverage'],

        // coverageReporter: {
        //     dir: 'coverage',
        //     reporters: [
        //         { type: 'html', subdir: 'report-html' }
        //     ]
        // }
    });

    config.set(configuration)
}
