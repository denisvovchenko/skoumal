const gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      del = require('del'),
      newer = require('gulp-newer'),
      imagemin = require('gulp-imagemin'),
      plumber = require('gulp-plumber'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      rename = require('gulp-rename'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      cssnano = require('cssnano'),
      eslint = require('gulp-eslint')

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

function clean() {
  return del(['./dist']);
}

function html() {
  return gulp
    .src('./src/index.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(browsersync.stream());
}

function css() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))    
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/css/'))
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(postcss([autoprefixer(), cssnano()]))
    // .pipe(gulp.dest('./dist/css/'))
    .pipe(browsersync.stream());
}

function watchFiles() {
  gulp.watch('./src/index.html', html);
  gulp.watch('./src/scss/**/*', css);
}

// const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, css);
const watch = gulp.parallel(watchFiles, browserSync);

exports.clean = clean;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;