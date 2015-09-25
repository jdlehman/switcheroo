var webpack = require('webpack');

module.exports = function(config) {
  config.set({

    // milliseconds
    browserNoActivityTimeout: 30000,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'test/setup.js',
      'test/test_index.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/setup.js': ['webpack', 'sourcemap'],
      'test/test_index.js': ['webpack', 'sourcemap']
    },


    webpack: {
      devtool: 'inline-source-map',
      cache: true,
      resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules', 'src'],
        fallback: __dirname
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
              auxiliaryCommentBefore: 'istanbul ignore next'
            }
          }
        ],
        postLoaders: [
          {
            test: /\.js$/,
            exclude: [
              /test\//,
              /node_modules\//
            ],
            loader: 'istanbul-instrumenter'
          }
        ]
      },
      externals: [
        {
          "window": "window"
        }
      ],
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        })
      ]
    },


    webpackMiddleware: {
      progress: false,
      stats: false,
      debug: false,
      noInfo: true,
      silent: true
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.CI,

    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-sinon',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],

    coverageReporter: {
      dir : 'coverage/',
      subdir: '.',
      reporters: [
        {type: 'lcov'},
        {type: 'text-summary'}
      ]
    }
  });
};
