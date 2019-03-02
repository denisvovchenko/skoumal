const gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      del = require('del'),
      newer = require('gulp-newer'),
      imagemin = require('gulp-imagemin'),
      plumber = require('gulp-plumber'),
      sass = require('gulp-sass'),
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

// function images() {
//   return gulp
//     .src('./src/img/**/*')
//     .pipe(newer('./dist/img'))
//     .pipe(
//       imagemin([
//         imagemin.jpegtran({ progressive: true }),
//         imagemin.optipng({ optimizationLevel: 5 }),
//         imagemin.svgo({
//           plugins: [
//             {
//               removeViewBox: false,
//               collapseGroups: true
//             }
//           ]
//         })
//       ])      
//     )
//     .pipe(gulp.dest('./dist/img'));
// }

// function html() {
//   return gulp
//     .src('./src/index.html')
//     .pipe(gulp.dest('./dist/'));
// }

function css() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('./src/css/'))
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(postcss([autoprefixer(), cssnano()]))
    // .pipe(gulp.dest('./src/css/'))
    .pipe(browsersync.stream());
}

// function scriptsLint() {
//   return gulp
//     .src(['./src/js/**/*', './gulpfile.js'])
//     .pipe(plumber())
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// }

// function scripts() {
//   return (
//     gulp
//       .src(['./src/js/**/*'])
//       .pipe(plumber())
//       .pipe(gulp.dest('./dist/js/'))
//       .pipe(browsersync.stream())
//   );
// }

function watchFiles() {
  gulp.watch('./src/scss/**/*', css);
  // gulp.watch('./src/js/**/*', gulp.series(scriptsLint, scripts));
  // gulp.watch(['./src/index.html'], browserSyncReload);
  // gulp.watch('./src/img/**/*', images);
}

// const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, css);
const watch = gulp.parallel(watchFiles, browserSync);

exports.clean = clean;
// exports.images = images;
exports.css = css;
// exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = build;