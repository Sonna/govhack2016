/*eslint-env node*/
var gulp = require('gulp');
var runSync = require('run-sequence');
var plugin = {};

plugin.server = require('browser-sync').create();
plugin.rename = require('gulp-rename');
plugin.sass = require('gulp-sass');
plugin.autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', sass);
gulp.task('serve', serve);
gulp.task('refresh', refresh);
gulp.task('watch', watch);
gulp.task('default', ['serve', 'watch']);

function refresh() {
  plugin.server.stream();
}

function watch() {
  gulp.watch('./scss/**/*.scss', function() {
    runSync('sass', 'refresh');
  });
  gulp.watch('*.html').on('change', plugin.server.reload);
}

function serve() {
  plugin.server.init({
    server: './'
  });
}

function sass() {
  gulp.src('./scss/main.scss')
  .pipe( plugin.sass() )
  .pipe( plugin.autoprefixer() )
  .pipe( plugin.rename('bundle.css') )
  .pipe( gulp.dest('bundle') )
  .pipe( plugin.server.stream() );
}
