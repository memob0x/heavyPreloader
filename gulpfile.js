'use strict';

const
    gulp       = require('gulp'),
    watch      = require('gulp-watch'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    pump       = require('pump'),
    merge      = require('gulp-merge'),
    rename     = require('gulp-rename'),
    babel      = require('gulp-babel'),
    minify     = require("gulp-babel-minify"),
    sass       = require('gulp-sass'),
    log        = require('fancy-log'),
    postcss    = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),

    resources  = [

        {
            paths: {
                src: './src/',
                dst: './dist/'
            },
            files : {
                js  : [ 'jquery.nite.preloader.js' ]
            }
        },

        {
            paths : {
                src: './test/assets/src/',
                dst: './test/assets/dist/'
            },
            files : {
                js: ['test.js'],
                css: ['test.scss']
            }
        }

    ];

let files = [],
    firstLoad = true;

gulp.task('default', function(cb) {

    resources.forEach(function(resource) {

        if( 'js' in resource.files && resource.files.js.length ) resource.files.js.forEach(function(file){

            file = resource.paths.src + file;

            if( true === firstLoad )
                files.push(file);

            pump([

                gulp.src(file),

                babel(),

                gulp.dest(resource.paths.dst),


                gulp.src(file),

                sourcemaps.init({largeFile: true}),

                babel(),

                rename({ suffix: '.min' }),

                minify(),

                sourcemaps.write(),

                gulp.dest(resource.paths.dst)

            ]);

        });

        if( 'css' in resource.files && resource.files.css.length ) resource.files.css.forEach(function(file, index, array){

            file = resource.paths.src + file;

            if( true === firstLoad )
                files.push(file);

            pump([

                gulp.src(file),

                sass({ outputStyle: 'expanded' }),

                postcss([ autoprefixer() ]),

                gulp.dest(resource.paths.dst),


                gulp.src(file),

                sourcemaps.init({largeFile: true}),

                sass({outputStyle: 'compressed' }),

                rename({ suffix: '.min' }),

                sourcemaps.write(),

                gulp.dest(resource.paths.dst)

            ], array.length - 1 === index ? cb : null);

        });

    });

    //log(files);

    if( true === firstLoad )
        gulp.watch(files, ['default']);

    firstLoad = false;

});