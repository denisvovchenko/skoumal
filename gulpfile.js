const gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      del = require('del'),
      // newer = require('gulp-newer'),
      // imagemin = require('gulp-imagemin'),
      rename = require('gulp-rename'),
      plumber = require('gulp-plumber'),
      sass = require('gulp-sass'),
      csso = require('gulp-csso'),
      sourcemaps = require('gulp-sourcemaps'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify')

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
    .pipe(csso())
    .pipe(rename('style.min.css'))
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
  .pipe(uglify())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('./src/js/'));
}

function watchFiles() {
  gulp.watch('./src/index.html', html);
  gulp.watch('./src/scss/**/*', css);
  gulp.watch('./src/js/app.js', scripts);
}

const build = gulp.series(css);
const watch = gulp.parallel(watchFiles, browserSync);

exports.js = scripts;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;
