var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
//var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var watchify    = require('watchify');
var runSequence = require('run-sequence');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var plugins     = require('gulp-load-plugins')({ lazy: false });

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./js/**/*.js']
};
var sourceDir = './js/',
    destDir   = './www/js/';

gulp.task('default', function() {
  //gulp.watch(paths.js, ['js']);
});

/*gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});*/

gulp.task('watch', function() {
  gulp.watch(paths.js, ['js']);
});

gulp.task('jshint', function () {
  // lint scripts
  return gulp.src([
      './js/**/*.js'
    ])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('js', function() {
  gulp.src([sourceDir + '**/app.js', sourceDir + '**/*.js'])
  .pipe(sourcemaps.init())
    .pipe(concat(destDir + 'compiled.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('.'));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
