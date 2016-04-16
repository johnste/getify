module.exports = function(config) {
    var configuration = {

        basePath: '../',

        exclude: [],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Edge'],

        // Custom launcher for Travis-CI
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        singleRun: false,

        concurrency: Infinity,
    }

    if(process.env.TRAVIS){
        configuration.browsers = ['Firefox']; //'Chrome_travis_ci',
    }

    return configuration;
}
