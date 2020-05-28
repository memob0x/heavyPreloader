module.exports = (config) =>
    config.set({
        frameworks: ["mocha", "chai"],
        files: [
            {
                pattern: "./test/**/*.mjs",
                type: "module"
            },
            {
                pattern: "./src/**/*.mjs",
                type: "module"
            },
            {
                pattern: "./test/resources/*",
                watched: false,
                included: false,
                served: true
            }
        ],
        reporters: ["mocha"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ["ChromeHeadless"],
        autoWatch: false,
        singleRun: false,
        concurrency: Infinity
    });
