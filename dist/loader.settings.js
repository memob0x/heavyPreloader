'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var supportedExtensions = exports.supportedExtensions = {
    image: ['jp[e]?g', 'jpe', 'jif', 'jfif', 'jfi', 'gif', 'png', 'tif[f]?', 'bmp', 'dib', 'webp', 'ico', 'cur', 'svg'],
    audio: ['mp3', 'ogg', 'oga', 'spx', 'ogg', 'wav'],
    video: ['mp4', 'ogg', 'ogv', 'webm']
};
var supportedTags = exports.supportedTags = {
    image: ['img', 'picture'],
    audio: ['audio'],
    video: ['video'],
    other: ['iframe'] };

var supportedTypes = exports.supportedTypes = Object.keys(supportedExtensions);
var allSupportedTags = exports.allSupportedTags = [].concat(_toConsumableArray(new Set(Object.values(supportedTags).reduce(function (a, b) {
    return a.concat(b);
}))));