'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.find = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _toolboxUtils = require('./toolbox/src/toolbox.utils.js');

var _loaderMedia = require('./loader.media.js');

var _loaderSettings = require('./loader.settings.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var find = exports.find = function find() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var settings = _extends({
        srcAttributes: {
            src: !!!options.lazy ? 'src' : 'data-src',
            srcset: !!!options.lazy ? 'srcset' : 'data-srcset'
        },
        sizesAttributes: {
            sizes: !!!options.lazy ? 'sizes' : 'data-sizes',
            media: !!!options.lazy ? 'media' : 'data-media'
        },
        backgrounds: false
    }, options);

    var collection = [];

    var tagsSelector = _loaderSettings.allSupportedTags.join(',');
    var srcAttributesValues = Object.values(settings.srcAttributes);
    var srcAttributesSelector = srcAttributesValues.map(function (x) {
        return '[' + x + ']';
    }).join(',');

    var targets = [].concat(_toConsumableArray(element.querySelectorAll(tagsSelector))).filter(function (el) {
        return !el.parentElement || el.parentElement.tagName.toLowerCase() !== 'picture';
    });
    if (element.matches(tagsSelector) && (!element.parentElement || element.parentElement.tagName.toLowerCase() !== 'picture')) {
        targets.push(element);
    }

    targets.forEach(function (target) {
        var source = target;

        if (target.querySelectorAll('source').length) {
            source = target.querySelectorAll('source');
            source = [].concat(_toConsumableArray(source))[0];
        }

        if (source.matches(srcAttributesSelector)) {
            var attribute = '';

            for (var i = 0, j = srcAttributesValues.length; i < j; i++) {
                attribute = source.getAttribute(srcAttributesValues[i]);
                if (attribute) {
                    break;
                }
            }

            collection.push(new _loaderMedia.Media({
                element: target,
                url: attribute
            }));
        }
    });

    if (true === settings.backgrounds) {
        targets = [].concat(_toConsumableArray(element.querySelectorAll('*')));
        targets.push(element);
        targets = targets.filter(function (target) {
            return !target.matches(tagsSelector);
        });
        targets = targets.filter(function (target) {
            return (0, _toolboxUtils.getComputed)(target, 'background-image') !== 'none';
        });
        targets.forEach(function (target) {
            var url = (0, _toolboxUtils.getComputed)(target, 'background-image').match(/\((.*?)\)/);

            if (null !== url && url.length >= 2) {
                collection.push(new _loaderMedia.Media({
                    element: target,
                    url: url[1].replace(/('|")/g, '')
                }));
            }
        });
    }

    return collection;
};