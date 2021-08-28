'use strict';

const {src, series, dest, watch, parallel} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const {exec} = require('child_process');
const fs = require('fs');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const path = require('path');
const postcss = require('gulp-postcss');
const pp = require('preprocess');
const preprocess = require("gulp-preprocess");
const purgecss = require('gulp-purgecss')
const {Remarkable} = require('remarkable');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const {Transform} = require('stream');
const toc = require('html-toc');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

let production = true;

// Define paths
const paths = {
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
        partialsDir: './partials/',
        partials: './partials/*.html',
        html: './html/*.html',
        css: './css/**/*.scss',
        js: './js/**/*.js',
        img: './img/**/*.+(png|jpg|gif|svg|ico)',
        md: './markdown/*.md',
        mdHtml: './markdown/*.html',
    },
    blog: {
        base: './blog'
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
        .pipe(purgecss({
            content: [paths.dist.base + '/*.html'],
            safelist: {
                standard: ['show'],
                deep: [/lb-*/, /lightbox*/]
            }
        }))
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
        .pipe(gulpif(!production, sourcemaps.init({loadMaps: true})))
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
        .pipe(preprocess({
            includeBase: paths.src.partialsDir,
            context: {
                ENABLE_MAILING_LIST: process.env.ENABLE_MAILING_LIST,
                ENABLE_WAITING_LIST: process.env.ENABLE_WAITING_LIST,
                ENABLE_DIRECT_PURCHASE: process.env.ENABLE_DIRECT_PURCHASE,
            }
        }))
        .pipe(dest(paths.dist.base))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// Copy images
function copyImages() {
    return src(paths.src.img)
        .pipe(imagemin())
        .pipe(dest(paths.dist.img))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function genTermsAndPrivacyPolicy() {
    return src(paths.src.md)
        .pipe(new Transform({
            readableObjectMode: true,
            writableObjectMode: true,
            transform(file, encoding, callback) {
                const md = new Remarkable();
                const mdContent = md.render(file.contents.toString());
                const dirname = path.dirname(file.path);
                const basename = path.basename(file.path, '.md');
                const tplPath = path.join(dirname, `${basename}.html`);
                const tplContent = fs.readFileSync(tplPath).toString();
                const html = pp.preprocess(
                    tplContent,
                    {
                        CONTENT: mdContent
                    }, {
                        type: 'html',
                        srcDir: paths.src.partialsDir
                    }
                );
                const htmlWithToc = toc(html, {
                    id: '#toc',
                    selectors: 'h2',
                    anchorsLink: false,
                });
                file.contents = Buffer.from(htmlWithToc);
                file.extname = '.html';
                callback(null, file);
            }
        }))
        .pipe(dest(paths.dist.base))
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

// Builds the blog for publishing
function buildBlog(done) {
    execHugo('', done);
}

// Serves the blog to develop posts
function serveBlog(done) {
    execHugo('server -D', done);
}

function execHugo(params, done) {
    const proc = exec(`hugo ${params}`, {
        cwd: paths.blog.base
    }, function (err, stdout, stderr) {
        done(err);
    });
    proc.stdout.on('data', console.log);
    proc.stderr.on('data', console.error);
}


// Live realoading

// Initialize the browsersync
function browserSyncInit(openTab) {
    return function browserReload(done) {
        browserSync.init({
            server: {
                baseDir: paths.dist,
            },
            port: 3000,
            open: openTab ? 'local' : false,
            notify: false,
            ghostMode: false,
        });
        done();
    }
}

function watchFiles() {
    watch([paths.src.md, paths.src.mdHtml], genTermsAndPrivacyPolicy);
    watch(paths.src.js, compileJs);
    watch(paths.src.css, compileScss);
    watch(paths.src.img, copyImages);
    watch([paths.src.html, paths.src.partials], series(copyHtml, compileScss));
}

function isBoolTrue(str) {
    return (/^(true|1|t)$/i).test(str);
}

function validateMode(cb) {
    const enabledModes = [
        process.env.ENABLE_MAILING_LIST,
        process.env.ENABLE_WAITING_LIST,
        process.env.ENABLE_DIRECT_PURCHASE
    ].filter((e) => isBoolTrue(e));
    if (enabledModes.length > 1) {
        cb(new Error('Only one of ENABLE_MAILING_LIST, ENABLE_WAITING_LIST, ENABLE_DIRECT_PURCHASE may be defined'));
    } else if (enabledModes.length === 0) {
        process.env.ENABLE_MAILING_LIST = true;
    }
    cb();
}

// Build everything
const build = series(validateMode, clean, copyImages, copyHtml, compileScss, compileJs, buildBlog, genTermsAndPrivacyPolicy);

// Build and start the livereload server
function dev() {
    production = false;
    return series(build, browserSyncInit(true), watchFiles)();
}

// Build and start the livereload server but don't open a new
// browser tab.
function devNoOpen() {
    production = false;
    return series(build, browserSyncInit(false), watchFiles)();
}

exports.clean = clean;
exports.dev = dev;
exports.devNoOpen = devNoOpen;
exports.serveBlog = serveBlog;
exports.build = build;
exports.default = build;
