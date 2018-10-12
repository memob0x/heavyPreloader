'use strict';

const gulp = require('gulp');

const Tasks = {
    // ...require('./tasks/demos.js'),
    ...require('./tasks/library.js')
    // ...require('./tasks/test.js')
};

gulp.task('clean', gulp.parallel(Tasks.libraryClean /*, Tasks.demosClean*/));
gulp.task('library', gulp.series('clean', Tasks.libraryRollup));
// gulp.task('demos', gulp.series('clean', gulp.parallel(Tasks.demosStyles, Tasks.demosStyles)));
// gulp.task('test', gulp.series('clean', gulp.parallel(Tasks.demosStyles, Tasks.demosStyles)));
gulp.task('build', gulp.series('clean', Tasks.libraryRollup));
