const gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      del = require('del'),
      // newer = require('gulp-newer'),
      // imagemin = require('gulp-imagemin'),
      // cssnano = require('cssnano'),
      rename = require('gulp-rename'),
      plumber = require('gulp-plumber'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      babel = require('gulp-babel');

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './src'
    },

    port: 3000
  });

  done();
}

function browserSyncReload(done) {
  browsersync.reload();

  done();
}

function html() {
  return gulp
    .src('./src/index.html')
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
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/css/'))
    .pipe(browsersync.stream());
}

function scripts() {
  return gulp
  .src('./src/js/app.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(rename('script.js'))
  .pipe(gulp.dest('./src/js/'));
}

const js = gulp.series(scripts);

function watchFiles() {
  gulp.watch('./src/index.html', html);
  gulp.watch('./src/scss/**/*', css);
  gulp.watch('./js/**/*', js);
}

const build = gulp.series(css);
const watch = gulp.parallel(watchFiles, browserSync);

exports.clean = clean;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;
