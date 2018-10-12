const gulp = require('gulp');
const pump = require('pump');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');
const minify = require('gulp-minify');
const log = require('fancy-log');
const configuration = require('../../gulpfile.json')[0];

const libraryClean = done => {
    del.sync('../dist/', { force: true });
    done();
};

const libraryRollup = done => {
    const source = '../src/loader.js';

    // processedFiles.js.push(source);

    return pump(
        [
            gulp.src(source),
            sourcemaps.init(configuration.sourcemaps),
            rollup(
                {},
                {
                    ...configuration.rollup,
                    name: 'Loader'
                }
            ).on('error', err => log(err)),
            babel(configuration.babel).on('error', err => log(err)),
            minify({ ext: { min: '.min.js' } }),
            sourcemaps.write('.'),
            gulp.dest('../dist/')
        ],
        done
    );
};

module.exports = {
    libraryRollup: libraryRollup,
    libraryClean: libraryClean
};
