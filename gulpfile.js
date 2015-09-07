'use strict'
var path = require('path')
var gulp = require('gulp')
var gutil = require('gulp-util')
var excludeGitignore = require('gulp-exclude-gitignore')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')
var nsp = require('gulp-nsp')
var plumber = require('gulp-plumber')
var coveralls = require('gulp-coveralls')
var babel = require('gulp-babel')

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register')

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch('./**/*.js', {read: true}, ['test'])
})

gulp.task('nsp', function (cb) {
  nsp('package.json', cb)
})

gulp.task('pre-test', function () {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
})

gulp.task('test', ['pre-test'], function (cb) {
  gulp.src('test/**/*Spec.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
      harmony_proxies: true
    }))
    .pipe(istanbul.writeReports({
      reporters: ['text', 'text-summary', 'json']
    }))
    .on('error', gutil.log)
})

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls())
})

gulp.task('babel', function () {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})

gulp.task('prepublish', ['nsp', 'babel'])
gulp.task('default', ['test', 'coveralls'])
