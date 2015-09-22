'use strict';
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var coveralls = require('gulp-coveralls');
var babel = require('gulp-babel');
var isparta = require('isparta');
var runSequence = require('run-sequence');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel/register');

// Files to process
var TEST_FILES = 'test/**/*Spec.js';
var SRC_FILES = 'lib/**/*.js';

/*
 * Instrument files using istanbul and isparta
 */
gulp.task('coverage:instrument', function () {
  return gulp.src(SRC_FILES)
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter // Use the isparta instrumenter (code coverage for ES6)
    // Istanbul configuration (see https://github.com/SBoudrias/gulp-istanbul#istanbulopt)
    // ...
    }))
    .pipe(istanbul.hookRequire()); // Force `require` to return covered files
});

/*
 * Write coverage reports after test success
 */
gulp.task('coverage:report', function (done) {
  return gulp.src(SRC_FILES, {read: false})
    .pipe(istanbul.writeReports({
      // Istanbul configuration (see https://github.com/SBoudrias/gulp-istanbul#istanbulwritereportsopt)
      // ...
    }));
});

/**
 * Run unit tests
 */
gulp.task('test', function () {
  return gulp.src(TEST_FILES, {read: false})
    .pipe(mocha({
      // require: [__dirname + '/lib/jsdom'] // Prepare environement for React/JSX testing
    }));
});

/**
 * Run unit tests with code coverage
 */
gulp.task('test:coverage', function (done) {
  runSequence('coverage:instrument', 'test', 'coverage:report', done);
});

/**
 * Watch files and run unit tests on changes
 */
gulp.task('tdd', function (done) {
  gulp.watch([
    TEST_FILES,
    SRC_FILES
  ], ['test']).on('error', gutil.log);
});

gulp.task('nsp', function (cb) {
  nsp('package.json', cb);
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('babel', function () {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['test', 'coveralls']);
