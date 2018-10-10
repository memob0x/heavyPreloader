'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var switchAttributes = exports.switchAttributes = function switchAttributes(el, attrs) {
    Object.keys(attrs).forEach(function (attr) {
        var dataAttr = attrs[attr];
        dataAttr = dataAttr === 'src' || dataAttr === 'srcset' ? 'data-' + dataAttr : dataAttr;
        var dataAttrVal = el.getAttribute(dataAttr);

        if (dataAttrVal) {
            el.setAttribute(attr, dataAttrVal);
            el.removeAttribute(dataAttr);
        }
    });
};

var copyAttributes = exports.copyAttributes = function copyAttributes(el, target, attributes) {
    return attributes.forEach(function (attr) {
        var attribute = target.getAttribute(attr);
        if (attribute) {
            el.setAttribute(attr === 'src' || attr === 'srcset' ? 'data-' + attr : attr, attribute);
        }
    });
};

var removeAttributes = exports.removeAttributes = function removeAttributes(el, attributes) {
    return attributes.forEach(function (attr) {
        return el.removeAttribute(attr);
    });
};