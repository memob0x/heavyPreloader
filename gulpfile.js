'use strict';

const
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    pump = require('pump'),
    merge = require('gulp-merge'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    minify = require("gulp-babel-minify"),
    sass = require('gulp-sass'),
    log = require('fancy-log'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    clear = require('clear'),
    uglify = require("gulp-uglify"),

    resources = [

        {
            paths: {
                src: './src/',
                dst: './dist/'
            },
            files: {
                js: ['nite.loader.js']
            }
        },

        {
            paths: {
                src: './test/assets/src/',
                dst: './test/assets/dist/'
            },
            files: {
                js: ['test.js'],
                css: ['test.scss']
            }
        }

    ];

let watchedFiles = [];
resources.forEach((resource) => {
    Object.keys(resource.files).forEach((type) => {
        watchedFiles = watchedFiles.concat(resource.paths.src + resource.files[type]);
    });
});

gulp.task('default', (callback) => {

    clear();
    log();

    log(watchedFiles);

    let count = 0;

    const maybeCallback = () => {

        count++;

        if (count === watchedFiles.length) {
            callback();
        }

    };

    resources.forEach((resource) => {

        if ('js' in resource.files && resource.files.js.length) resource.files.js.forEach((filename) => {

            pump([

                gulp.src(resource.paths.src + filename),

                sourcemaps.init({ largeFile: true }),

                babel(),//.on('error', function(error){ log(error); }),

                sourcemaps.write('.'),

                gulp.dest(resource.paths.dst),

                gulp.src(resource.paths.src + filename),

                sourcemaps.init({ largeFile: true }),

                babel({ compact: true }),//.on('error', function(error){ log(error); }),

                uglify(),

                rename({ suffix: '.min' }),

                sourcemaps.write('.'),

                gulp.dest(resource.paths.dst)

            ], maybeCallback);

        });

        if ('css' in resource.files && resource.files.css.length) resource.files.css.forEach((filename) => {

            pump([

                gulp.src(resource.paths.src + filename),

                sourcemaps.init({ loadMaps: true, largeFile: true }),

                sass({ outputStyle: 'expanded' }),

                postcss([autoprefixer()]),

                sourcemaps.write('.'),

                gulp.dest(resource.paths.dst),

                gulp.src(resource.paths.src + filename),

                sourcemaps.init({ loadMaps: true, largeFile: true }),

                sass({ outputStyle: 'compressed' }),

                postcss([autoprefixer()]),

                rename({ suffix: '.min' }),

                sourcemaps.write('.'),

                gulp.dest(resource.paths.dst)

            ], maybeCallback);

        });

    });

    gulp.watch(watchedFiles, ['default']);

});