'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const pump = require('pump');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const log = require('fancy-log');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const clear = require('clear');
const minify = require('gulp-minify');
const run = require('gulp-run');

const resources = [
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
resources.forEach(resource => {
	for (let type in resource.files) {
		watchedFiles = watchedFiles.concat(resource.paths.src + resource.files[type]);
	}
});

let pumpCounter = 0;
const pumpCallback = args => {
	pumpCounter++;
	if (pumpCounter === watchedFiles.length) {
		args[0]();
	}
};

const sourcemapsConf = { loadMaps: true, largeFile: true };

gulp.task('default', callback => {
	clear();
	pumpCounter = 0;
	log(watchedFiles);
	resources.forEach(resource => {
		if ('js' in resource.files && resource.files.js.length) {
			resource.files.js.forEach(filename =>
				pump(
					[
						// transpilation
						gulp.src(resource.paths.src + filename),
						sourcemaps.init(sourcemapsConf),
						babel().on('error', err => log(err)),
						sourcemaps.write('.'),
						gulp.dest(resource.paths.dst),
						// minification
						gulp.src(resource.paths.src + filename),
						sourcemaps.init(sourcemapsConf),
						babel().on('error', err => log(err)),
						minify({ ext: { min: '.min.js' } }),
						sourcemaps.write('.'),
						gulp.dest(resource.paths.dst)
					],
					pumpCallback.bind(this, [callback])
				)
			);
		}
		if ('css' in resource.files && resource.files.css.length) {
			resource.files.css.forEach(filename =>
				pump(
					[
						// transpilation
						gulp.src(resource.paths.src + filename),
						sourcemaps.init(sourcemapsConf),
						sass({ outputStyle: 'expanded' }),
						postcss([autoprefixer()]),
						sourcemaps.write('.'),
						gulp.dest(resource.paths.dst),
						// minification
						gulp.src(resource.paths.src + filename),
						sourcemaps.init(sourcemapsConf),
						sass({ outputStyle: 'compressed' }),
						postcss([autoprefixer()]),
						rename({ suffix: '.min' }),
						sourcemaps.write('.'),
						gulp.dest(resource.paths.dst)
					],
					pumpCallback.bind(this, [callback])
				)
			);
		}
	});
	gulp.watch(watchedFiles, ['default']);
});
