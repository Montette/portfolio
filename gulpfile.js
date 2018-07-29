//Deklaracja zmiennych
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var babili = require("gulp-babili");
var del = require('del');
var runSequence = require('run-sequence').use(gulp);
var autoprefixer = require('gulp-autoprefixer');

//Definicja tasków
gulp.task('browserSync', function () {
    browserSync.init({
      server: {
      baseDir: 'src'
      },
    })
  })

  gulp.task('sass', () => {
    return gulp.src('src/sass/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
      }))
  });

  gulp.task('images', function () {
    return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
     })))
    .pipe(gulp.dest('dist/img'))
  });

  gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
  });

  gulp.task('useref', () => {
    return gulp.src('src/*.html')
    .pipe(useref()) 
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
  });


  gulp.task('scripts', function () {
    return gulp.src(['src/js/*.js'])
    .pipe(concat('main.min.js'))
    .pipe(babili({
      mangle: {
        keepClassNames: true
      }
    }))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist/js'));
  })

  gulp.task('clean:dist', () => {
    return del.sync('dist');
  })

  gulp.task('serve', function (callback) {
    runSequence(['watch', 'sass', 'browserSync'],
      callback
    )
  })

  gulp.task('build', function (callback) {
    runSequence('clean:dist', ['serve', 'images'], 'useref', 'scripts',
      callback)
 })