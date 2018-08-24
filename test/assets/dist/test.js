'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var consoleDiv = document.querySelector('#console');
var consoleLog = function consoleLog(string) {
    if (!consoleDiv.hasChildNodes()) {
        var ol = document.createElement('ol');
        consoleDiv.append(ol);
    }

    var list = consoleDiv.querySelector('ol');
    var li = document.createElement('li');
    li.innerHTML = string;
    list.append(li);

    consoleDiv.scrollTop = list.offsetHeight;
};
[].concat(_toConsumableArray(document.querySelectorAll('.playground'))).forEach(function (element) {
    var _ref;

    var loadInstance = new Loader((_ref = {
        srcAttr: 'data-src',
        srcsetAttr: 'data-srcset',
        playthrough: false,
        visible: true,
        backgrounds: true

    }, _defineProperty(_ref, 'playthrough', 'full'), _defineProperty(_ref, 'early', false), _defineProperty(_ref, 'earlyTimeout', 6000), _ref));

    loadInstance.collection = element;

    loadInstance.observe();

    loadInstance.load();
});

/*  onComplete: function(instance, resources) {
        $(this).addClass('complete');
    },

    onProgress: function(instance, resource) {
        $(this)
            .find('[data-percentage]')
            .attr('data-percentage', instance.percentage)
            .closest('.playground__percentage')
            .addClass('visible');
    },

    onLoad: function(instance, resource) {
        $(this).addClass('has-loads');
    },
    onError: function(instance, resource) {
        $(this).addClass('has-errors');
    } */

document.addEventListener('resourceLoad', function (e) {
    consoleLog('Loader() load: ' + e.detail.resource);
});

document.addEventListener('resourceError', function (e) {
    consoleLog('Loader() error: ' + e.detail.resource);
});

[].concat(_toConsumableArray(document.querySelectorAll('figure img, figure video'))).forEach(function (el) {
    el.addEventListener('resourceLoad', function (e) {
        return e.detail.element.closest('figure').classList.add('loaded');
    });
    el.addEventListener('resourceError', function (e) {
        return e.detail.element.closest('figure').classList.add('loaded-error');
    });
});

var instance = void 0;
var instanceSequentialMode = true;

document.querySelector('.program-mode--sequential').addEventListener('click', function () {
    if (instance !== null) {
        return;
    }

    document.querySelector('.program-mode--parallel').style.display = 'block';
    document.querySelector('.program-mode--sequential').style.display = 'none';

    instanceSequentialMode = true;
    consoleLog('Loader(): Sequential Mode');
});

document.querySelector('.program-mode--parallel').addEventListener('click', function () {
    if (instance !== null) {
        return;
    }

    document.querySelector('.program-mode--sequential').style.display = 'block';
    document.querySelector('.program-mode--parallel').style.display = 'none';

    instanceSequentialMode = false;
    consoleLog('Loader(): Parallel Mode');
});

[].concat(_toConsumableArray(document.querySelectorAll('[class*="program-load"]'))).forEach(function (el) {
    return el.addEventListener('click', function () {
        if (instance) {
            consoleLog('Loader(): Aborted...');

            instance.abort();
            instance = null;

            document.querySelector('.program-load--run').style.display = 'block';
            document.querySelector('.program-load--kill').style.display = 'none';
        } else {
            document.querySelector('.program-load--run').style.display = 'none';
            document.querySelector('.program-load--kill').style.display = 'block';

            var randomResources = [];

            for (var i = 0; i < 10; i++) {
                var letters = '0123456789ABCDEF',
                    colors = [];

                for (var ii = 0; ii < 2; ii++) {
                    var color = '';
                    for (var c = 0; c < 6; c++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    colors[ii] = color;
                }

                randomResources.push('//placehold.it/720x720/' + colors[0] + '/' + colors[1] + '.jpg');
            }

            instance = new Loader({
                sequential: instanceSequentialMode
            });

            instance.collection = randomResources;

            consoleLog('Loader(): 0% - Starting...');

            instance.progress(function (resource) {
                consoleLog('Loader(): ' + instance.percentage + '%');
            });

            instance.done(function (resources) {
                consoleLog('Loader(): 100% - Done!!');
                document.querySelector('.program-load--run').style.display = 'block';
                document.querySelector('.program-load--kill').style.display = 'none';

                instance = null;
            });

            instance.load();
        }
    });
});
//# sourceMappingURL=test.js.map
