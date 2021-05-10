process.env.CHROME_BIN = './.local-chromium/chromium-linux-869685/chrome-linux/chrome';

module.exports = config => config.set({
    frameworks: ['mocha', 'chai'],
    files: [
        { pattern: './test/**/*.spec.js', type: 'module' },
        { pattern: './src/**/*.js', type: 'module' },
        {
            pattern: './test/resources/*',
            watched: false,
            included: false,
            served: true
        }
    ],
    reporters: ['mocha'],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity
});
