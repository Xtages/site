'use strict';

const { src, series, dest, watch, parallel } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const { sync } = require('fast-glob');

let production = true;

// Define paths
var paths = {
	dist: {
		base: 'dist',
		css: 'dist/css',
		js: 'dist/js',
		img: 'dist/img'
	},
	quick: {
		base: 'vendor/quick-website-ui-kit-v1.1.1',
		js: 'vendor/quick-website-ui-kit-v1.1.1/resources/js',
		css: 'vendor/quick-website-ui-kit-v1.1.1/resources/scss',
	},
	src: {
		base: '.',
		html: './*.html',
		css: './css/**/*.scss',
		js: './js/**/*.js',
		img: './img/**/*.+(png|jpg|gif|svg)',
	}
}

// Compile SCSS
function compileScss() {
	return src(paths.src.css)
		.pipe(gulpif(!production, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([require('postcss-flexbugs-fixes')]))
		.pipe(autoprefixer())
		.pipe(cleanCss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulpif(!production, sourcemaps.write('./')))
		.pipe(dest(paths.dist.css))
		.pipe(browserSync.reload({
			stream: true
		}));
}

// Compile JS
function compileJs() {
	const b = browserify({
		entries: paths.src.base + '/js/index.js',
		debug: true
	});

	return b
		.transform('babelify', {
			presets: ["@babel/preset-env"],
			global: true,
			ignore: [/\/node_modules\/(?!bootstrap\/)/]
		})
		.bundle()
		.pipe(source(paths.dist.js + '/index.js'))
		.pipe(buffer())
		.pipe(gulpif(!production, sourcemaps.init({ loadMaps: true })))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulpif(!production, sourcemaps.write('./')))
		.pipe(dest('./'))
		.pipe(browserSync.reload({
			stream: true
		}));
}

// Copy HTML
function copyHtml() {
	return src(paths.src.html)
		.pipe(dest(paths.dist.base))
		.pipe(browserSync.reload({
			stream: true
		}));
};

// Copy images
function copyImages() {
	return src(paths.src.img)
		.pipe(imagemin())
		.pipe(dest(paths.dist.img))
		.pipe(browserSync.reload({
			stream: true
		}));
}


// Clean
function clean() {
	return del([
		paths.dist.base,
	]);
}

// Live realoading 

// Initialize the browsersync
function browserSyncInit(done) {
	browserSync.init({
		server: {
			baseDir: paths.dist,
		},
		port: 3000
	});
	done();
}

function watchFiles() {
	watch(paths.src.js, compileJs);
	watch(paths.src.css, compileScss);
	watch(paths.src.img, copyImages);
	watch(paths.src.html, copyHtml);
}

const livereload = series(browserSyncInit, watchFiles);

// Build everything
const build = series(clean, copyImages, copyHtml, compileScss, compileJs);

// Build and start the livereload server
function dev() {
	production = false;
    return series(build, livereload)();
}

exports.clean = clean;
exports.dev = dev;
exports.build = build;
exports.default = build;
