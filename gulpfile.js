// command list:
// gulp
// gulp --development
// gulp --development --nowatch

'use strict';

const arg = (argList => {
	let arg = {},
		a,
		opt,
		thisOpt,
		curOpt;
	for (a = 0; a < argList.length; a++) {
		thisOpt = argList[a].trim();
		opt = thisOpt.replace(/^\-+/, '');

		if (opt === thisOpt) {
			if (curOpt) {
				arg[curOpt] = opt;
			}

			curOpt = null;
		} else {
			curOpt = opt;

			arg[curOpt] = true;
		}
	}

	return arg;
})(process.argv);

const production = !arg.development;

const gulp = require('gulp');
const watch = require('gulp-watch');
const gulpif = require('gulp-if');
const pump = require('pump');
const rename = require('gulp-rename');
const del = require('del');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const minify = require('gulp-minify');
const autoprefixer = require('autoprefixer');
const log = require('fancy-log');
const clear = require('clear');

const resources = [
	{
		paths: {
			src: './src/',
			dist: './dist/'
		},
		files: {
			js: { module: 'NiteLoader', list: ['nite.loader.js'] }
		}
	},
	{
		paths: {
			src: './test/assets/src/',
			dist: './test/assets/dist/'
		},
		files: {
			js: { list: ['test.js'] },
			css: { list: ['test.scss'] }
		}
	}
];

const sourcemapsConf = { loadMaps: true, largeFile: true };

let watchedFiles = [];
resources.forEach(resource => {
	for (let type in resource.files) {
		watchedFiles = watchedFiles.concat(resource.paths.src + resource.files[type].list);
	}
});

let pumpCounter = 0;
const pumpCallback = args => {
	pumpCounter++;

	if (pumpCounter === watchedFiles.length) {
		args[0]();
	}
};

gulp.task('clean', done => {
	resources.forEach(resource => {
		del.sync(resource.paths.dist);
	});

	done();
});

gulp.task('build', callback => {
	pumpCounter = 0;

	resources.forEach(resource => {
		// js files
		if ('js' in resource.files && resource.files.js.list.length) {
			const isModule = 'module' in resource.files.js && !!resource.files.js.module;
			const moduleConf = {
				name: resource.files.js.module,
				format: 'umd'
			};

			// prettier-ignore
			resource.files.js.list.forEach(filename => pump([

				// rollup modules + transpilation to ES5 (production only)
				gulp.src(resource.paths.src + filename),
				gulpif(production, sourcemaps.init(sourcemapsConf)),
				gulpif(isModule, rollup({}, moduleConf)),
				gulpif(production, babel()),
				gulpif(production, sourcemaps.write('.')),
				gulp.dest(resource.paths.dist),

				// minification (production only)
				gulpif(production, gulp.src(resource.paths.src + filename)),
				gulpif(production, sourcemaps.init(sourcemapsConf)),
				gulpif(production && isModule, rollup({}, moduleConf)),
				gulpif(production, babel()),
				gulpif(production, minify({ ext: { min: '.min.js' } })),
				gulpif(production, sourcemaps.write('.')),
				gulpif(production, gulp.dest(resource.paths.dist))

			], pumpCallback.bind(this, [callback])));
		}

		// css files
		if ('css' in resource.files && resource.files.css.list.length) {
			// prettier-ignore
			resource.files.css.list.forEach(filename => pump([

				// transpilation to standard CSS
				gulp.src(resource.paths.src + filename),
				gulpif(production,sourcemaps.init(sourcemapsConf)),
				sass({ outputStyle: 'expanded' }),
				postcss([autoprefixer()]),
				gulpif(production, sourcemaps.write('.')),
				gulp.dest(resource.paths.dist),

				// minification (production only)
				gulpif(production, gulp.src(resource.paths.src + filename)),
				gulpif(production, sourcemaps.init(sourcemapsConf)),
				gulpif(production, sass({ outputStyle: 'compressed' })),
				gulpif(production, postcss([autoprefixer()])),
				gulpif(production, rename({ suffix: '.min' })),
				gulpif(production, sourcemaps.write('.')),
				gulpif(production, gulp.dest(resource.paths.dist)),

			], pumpCallback.bind(this, [callback])));
		}
	});

	if (!production && !arg.nowatch) {
		gulp.watch(watchedFiles, ['default']);
	}
});

gulp.task('default', ['clean', 'build'], () => {
	clear();
	log('');
	log('NiteLoader Build: ' + (production ? 'Production' : 'Development'));
	log('--------------------------------------');
	log(watchedFiles);
	log('--------------------------------------');
});
