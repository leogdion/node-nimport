var gulp = require('gulp');
var mocha = require('gulp-mocha');
var bump = require('gulp-bump');
var jshint = require('gulp-jshint');
var beautify = require('gulp-beautify');
var istanbul = require("gulp-istanbul");
var coverageEnforcer = require("gulp-istanbul-enforcer");
var args = require('minimist')(process.argv.slice(2));

gulp.task('default', ['beautify', 'lint', 'test', 'enforce-coverage', 'bump']);

var key = args.strict ? "strict" : "loose";

var thresholds = {
  strict: {
    statements: 85,
    branches: 80,
    functions: 80,
    lines: 85
  },
  loose: {
    statements: 85,
    branches: 80,
    functions: 75,
    lines: 85
  }
};

gulp.task('enforce-coverage', function () {
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
  gulp.src(['./lib/**/*.js', './bin/**/*', './bin/**/*.js', './test/**/*.js', './gulpfile.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2,
    preserveNewlines: true
  })).pipe(gulp.dest('.'));
});