const gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      rename = require('gulp-rename'),
      plumber = require('gulp-plumber'),
      sass = require('gulp-sass'),
      csso = require('gulp-csso'),
      sourcemaps = require('gulp-sourcemaps'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      babel = require('gulp-babel'),
      posthtml = require('gulp-posthtml'),
      include = require('posthtml-include'),
      webp = require('gulp-webp');

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './build'
    },

    port: 3000
  });

  done();
}

function browserSyncReload(done) {
  browsersync.reload();

  done();
}

function clean() {
  return del('!build/img/', 'build/');
}

function html() {
  return gulp
    .src('./src/**/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build/'))
    .pipe(browsersync.stream());
}

function css() {
  return gulp
    .src('./src/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css/'))
    .pipe(browsersync.stream());
}

function scripts() {
  return gulp
  .src('./src/js/script.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('build/js/'));
}

function imagesClean() {
  return del('build/img');
}

function images() {
  return gulp
    .src('src/img/**/*.{jpg,png,svg}')
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img/'));
}

function createWebp() {
  return gulp
    .src('build/img/**/*.{jpg,png}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img/'));
}

const js = gulp.series(scripts);

function watchFiles() {
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/scss/**/*', css);
  gulp.watch('js/**/*', js);
}

const buildImages = gulp.series(imagesClean, images, createWebp);
const build = gulp.series(clean, css, js, html);
const watch = gulp.parallel(watchFiles, browserSync);

exports.images = buildImages;
exports.clean = clean;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;
