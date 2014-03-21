var gulp = require('gulp');
var nodeunit_runner = require("gulp-nodeunit-runner");
var bump = require('gulp-bump');
var jshint = require('gulp-jshint');
var beautify = require('gulp-beautify');

gulp.task('default', ['beautify', 'lint', 'test', 'bump']);

gulp.task('test', function () {
  gulp.src("./test/**/*.js").pipe(nodeunit_runner());
});

gulp.task('bump', function () {
  gulp.src('./package.json').pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

gulp.task('lint', function () {
  gulp.src(['./lib/**/*.js', './bin/**/*', './bin/**/*.js', './test/**/*.js', './gulpfile.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('beautify', function () {
  gulp.src(['./lib/**/*.js', './bin/**/*', './bin/**/*.js', './test/**/*.js', './gulpfile.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2,
    preserveNewlines: true
  })).pipe(gulp.dest('.'));
});