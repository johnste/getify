// Karma configuration
// Generated on Fri Mar 11 2016 23:23:43 GMT+0100 (CET)

module.exports = function(config) {
    var configuration = {

        basePath: '',

        frameworks: ['requirejs', 'mocha', 'chai'],

        files: [
          'test/test-main.js',
          {pattern: 'lib/**/*.js', included: false},
          {pattern: 'test/**/*.spec.js', included: false}
        ],

        exclude: [],

        preprocessors: {
            'lib/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'IE', 'Edge'],

        // Custom launcher for Travis-CI
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        singleRun: false,

        concurrency: Infinity,

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                { type: 'html', subdir: 'report-html' }
            ]
        }
    }

    if(process.env.TRAVIS){
        configuration.browsers = ['Chrome_travis_ci', 'Firefox'];
    }

    config.set(configuration)
}
