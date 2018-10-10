(function(files, initCallback) {
    var _tests = [];
    var _paths = {};

    // filters out js files and tests
    for (var file in files) {
        if (files.hasOwnProperty(file)) {
            if (/^\/base\/.*?\/loader.*?\.js$/.test(file)) {
                var name = file.replace(/\/base\/(dist|tests)\/|.js$/, '');
                if (/test\.js$/.test(file)) {
                    _tests.push(file);
                } else {
                    _paths[name] = file.slice(0, -3);
                }
            }
        }
    }

    return {
        baseUrl: '/',
        paths: _paths,
        deps: _tests,
        callback: initCallback
    };
})(window.__karma__.files, window.__karma__.start);
