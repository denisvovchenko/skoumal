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
      uglify = require('gulp-uglify'),
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
  return del(['build/*', '!build/img']);
}

function html() {
  return gulp
    .src('./src/*.html')
    .pipe(posthtml([
      include({encoding: 'utf8'}),
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
  .src('src/js/**.js')
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/js/'));
}

function imagesClean() {
  return del('build/img');
}

function images() {
  return gulp
    .src('src/img/**/*.{jpg,png,svg,ico}')
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

function watchFiles() {
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/scss/**/*', css);
  gulp.watch('src/js/**/*', scripts);
}

function copyOtherFiles() {
  return gulp
    .src(['src/*.ico'])
    .pipe(gulp.dest('build'));
}

function fonts() {
  return gulp
    .src('src/fonts/*')
    .pipe(gulp.dest('build/fonts'));
}

const buildImages = gulp.series(imagesClean, images, createWebp);
const build = gulp.series(clean, css, scripts, html, fonts, copyOtherFiles);
const watch = gulp.parallel(watchFiles, browserSync);

exports.copyOtherFiles = copyOtherFiles;
exports.images = buildImages;
exports.clean = clean;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;
