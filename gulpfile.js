var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    bump = require('gulp-bump'),
    jshint = require('gulp-jshint'),
    beautify = require('gulp-beautify'),
    istanbul = require("gulp-istanbul"),
    coverageEnforcer = require("gulp-istanbul-enforcer"),
    coveralls = require('gulp-coveralls');
args = require('minimist')(process.argv.slice(2));

gulp.task('default', ['beautify', 'lint', 'test', 'enforce-coverage', 'coveralls', 'bump']);

var key = args.strict ? "strict" : "loose";

var thresholds = {
  strict: {
    statements: 95,
    branches: 95,
    functions: 95,
    lines: 95
  },
  loose: {
    statements: 95,
    branches: 85,
    functions: 95,
    lines: 95
  }
};

gulp.task('coveralls', ['enforce-coverage'], function () {
  gulp.src('coverage/**/lcov.info').pipe(coveralls());
});

gulp.task('enforce-coverage', ['test'], function () {
  var options = {
    thresholds: thresholds[key],
    coverageDirectory: 'coverage',
    rootDirectory: ''
  };
  return gulp.src(['./lib/**/*.js', './bin/**/*', './bin/**/*.js']).pipe(coverageEnforcer(options));
});

gulp.task('test', function (cb) {
  gulp.src(['./lib/**/*.js', './bin/**/*', './bin/**/*.js']).pipe(istanbul()) // Covering files
  .on('end', function () {
    gulp.src(["./test/**/*.js"]).pipe(mocha()).pipe(istanbul.writeReports()) // Creating the reports after tests runned
    .on('end', cb);
  });
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
  gulp.src(['./lib/**/*.js', './bin/**/*', './bin/**/*.js', '!./bin/nimport.js', './test/**/*.js', './gulpfile.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2,
    preserveNewlines: true
  })).pipe(gulp.dest('.'));
});