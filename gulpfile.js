'use strict';

const clearRequire = module => {
    delete require.cache[require.resolve(module)];
    return require(module);
};
const gulp = require('gulp');
const glob = require('glob');
const watch = require('gulp-watch');
const pump = require('pump');
const rename = require('gulp-rename');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const minify = require('gulp-minify');
const autoprefixer = require('autoprefixer');
const log = require('fancy-log');
const hb = require('gulp-hb');
const configuration = require('./gulpfile.json')[0];

let processedFiles = {
    js: [],
    scss: [],
    html: [],
    json: []
};

// library micro tasks
// - - - - - - - - - - - - - - - - - - - -
// cleanup
gulp.task('library:clean', done => {
    del.sync('./dist/');
    done();
});

// minify js
gulp.task('library:js', callback => {
    const source = './src/loader.js';

    processedFiles.js.push(source);

    pump(
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
            babel().on('error', err => log(err)),
            minify({ ext: { min: '.min.js' } }),
            sourcemaps.write('.'),
            gulp.dest('./dist/')
        ],
        callback
    );
});

// demo pages micro tasks
// - - - - - - - - - - - - - - - - - - - -
// cleanup
gulp.task('demos:clean', done => {
    del.sync('./demos/assets/dist/');
    del.sync('./demos/*.html');
    done();
});
// transpile css
gulp.task('demos:scss', callback => {
    let pumpLine = [];

    glob.sync('demos/assets/src/pages/*.scss').forEach(source => {
        processedFiles.scss.push(source);

        pumpLine.push([
            gulp.src(source),
            sourcemaps.init(configuration.sourcemaps),
            sass(configuration.sass).on('error', err => log(err)),
            postcss([autoprefixer()]).on('error', err => log(err)),
            sourcemaps.write('.'),
            gulp.dest('./demos/assets/dist/')
        ]);
    });

    pump(pumpLine.reduce((a, b) => a.concat(b)), callback);
});
// rollup js includes and transpile
gulp.task('demos:js', callback => {
    let pumpLine = [];

    glob.sync('demos/assets/src/pages/*.js').forEach(source => {
        processedFiles.js.push(source);

        pumpLine.push([
            gulp.src(source),
            sourcemaps.init(configuration.sourcemaps),
            rollup({}, configuration.rollup).on('error', err => log(err)),
            babel().on('error', err => log(err)),
            sourcemaps.write('.'),
            gulp.dest('./demos/assets/dist/')
        ]);
    });

    pump(pumpLine.reduce((a, b) => a.concat(b)), callback);
});

const buildHTML = (modules, callback) => {
    let pumpLine = [];

    const main = './demos/assets/src/main.hbs';
    processedFiles.html.push(main);

    glob.sync('demos/assets/src/pages/*.hbs').forEach(source => {
        const file = source.match(/[^\\/]+$/)[0];
        const filestruct = file.split('.');

        processedFiles.html.push(source);

        if (filestruct.length === 2) {
            const filename = filestruct[0];

            const json = './demos/assets/src/pages/' + filename + '.json';
            processedFiles.json.push(json);

            pumpLine.push([
                gulp.src(main),
                hb(configuration.hbs)
                    .data(clearRequire(json))
                    .data({
                        modules: modules,
                        filename: filename
                    })
                    .partials({
                        content: '{{> ' + filename + '}}'
                    })
                    .partials(source)
                    .partials('./demos/assets/src/pages/' + filename + '.*.hbs'),
                rename({
                    basename: filename,
                    extname: '.html'
                }),
                gulp.dest('./demos/')
            ]);
        }
    });

    pump(pumpLine.reduce((a, b) => a.concat(b)), callback);
};
// build handlebar
gulp.task('demos:html', callback => buildHTML(true, callback));
// build handlebar es5
gulp.task('demos:html:es5', callback => buildHTML(false, callback));

// main tasks
// - - - - - - - - - - - - - - - - - - - -
// clean all
gulp.task('clean', ['library:clean', 'demos:clean']);
// setup library distribution (legacy ES5)
gulp.task('library', ['clean', 'library:js']);
gulp.task('library:watch', ['library'], () => gulp.watch(processedFiles.js, ['library']));
// setup demo pages
gulp.task('demos', ['clean', 'demos:scss', 'demos:html']);
gulp.task('demos:watch', ['demos'], () => {
    gulp.watch(processedFiles.scss, ['demos:scss']);
    gulp.watch([...processedFiles.html, ...processedFiles.json], ['demos:html']);
});
// setup demo pages for old browsers (ES5 and single file js with no modules)
gulp.task('demos:es5', ['clean', 'library', 'demos:scss', 'demos:js', 'demos:html:es5']);
gulp.task('demos:es5:watch', ['demos:es5'], () => {
    gulp.watch(processedFiles.scss, ['demos:scss']);
    gulp.watch([...processedFiles.html, ...processedFiles.json], ['demos:html:es5']);
    gulp.watch(processedFiles.js, ['library', 'demos:js']);
});
