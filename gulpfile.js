'use strict';
const   gulp         = require('gulp'),
        watch        = require('gulp-watch'),
        concat       = require('gulp-concat'),
        sourcemaps   = require('gulp-sourcemaps'), // todo
        pump         = require('pump'),
        merge        = require('gulp-merge'),
        rename       = require('gulp-rename'),
        babel        = require('gulp-babel'),
        minify       = require("gulp-babel-minify"),
        task         = 'default';

gulp.task(task, function(cb) {

    let filename = './src/jquery.nite.preloader.js',
        destination = './dist/';

    pump([

        gulp.src(filename),

        babel(),

        gulp.dest(destination)

    ]);

    pump([

        gulp.src(filename),

        sourcemaps.init({ largeFile: true }),

        babel(),

        rename({ suffix: '.min' }),

        minify(),

        sourcemaps.write(),

        gulp.dest(destination)

    ], cb);

    gulp.watch(filename, [task]);

});