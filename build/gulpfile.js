'use strict';

const gulp = require('gulp');

const Tasks = {
    ...require('./tasks/demos.js'),
    ...require('./tasks/library.js')
};

gulp.task('clean', gulp.parallel(Tasks.libraryClean, Tasks.demosClean));
gulp.task('build', gulp.parallel(Tasks.demosHtmlNativeModules, Tasks.demosStyles));
gulp.task('release', gulp.parallel(Tasks.libraryRollup, Tasks.demosHtml, Tasks.demosScripts, Tasks.demosStyles));
