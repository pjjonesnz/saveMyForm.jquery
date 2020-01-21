// Karma configuration
// Generated on Mon Jan 20 2020 15:56:27 GMT+1300 (New Zealand Daylight Time)

module.exports = function(config) {
    'use strict';

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            'karma-jquery',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jquery-ui-dist/jquery-ui.min.js',
            'spec/**/*spec.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            { pattern: 'spec/fixtures/*.html', included: false, served: true },
            'src/saveMyForm.jquery.js',
            {
                pattern: 'src/custom_callbacks/jqueryui.saveMyForm.js',
                included: false,
                served: true
            }
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        client: {
            //capture all console output and pipe it to the terminal, true is default
            captureConsole: true,
            //if true, Karma clears the context window upon the completion of running the tests, true is default
            clearContext: true,
            //run the tests on the same window as the client, without using iframe or a new window, false is default
            runInParent: false,
            //true: runs the tests inside an iFrame; false: runs the tests in a new window, true is default
            useIframe: true,
            jasmine: {
                //tells jasmine to run specs in semi random order, false is default
                random: false
            }
        },
        coverageReporter: {
            includeAllSources: true,
            dir: 'coverage/',
            reporters: [
                { type: 'text-summary' },
                { type: 'lcov', subdir: 'lcov' }
            ]
        }
    });
};
