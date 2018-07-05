'use strict';

// Default gulp modules
const gulp = require('gulp');
const tap = require('gulp-tap');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const rename = require('gulp-rename'); // Helps rename files or changing extensions
const babelMinify = require("gulp-babel-minify"); // Converts to ES5 before minifying
const gutil = require('gulp-util'); // Helps with debugging
const eslint = require('gulp-eslint');

// Additional release gulp modules
const env = require('gulp-env'); // For accessing environment variables
const runSequence = require('run-sequence'); // Runs a sequence of gulp tasks
const conventionalChangelog = require('gulp-conventional-changelog'); // Generates a changelog from git metadata
const args = require('yargs').argv; // Add additional arguments to the commands
const conventionalGithubReleaser = require('conventional-github-releaser'); // Make a new release from github metadata
const bump = require('gulp-bump'); // Increases the version number
const git = require('gulp-git'); // Run git functions with gulp
const fs = require('fs'); // For working with the local file system

// Define the location of our build directory
const destination = 'dist/';
const source = 'src/ajaxinate.js';

var type = 'patch';
var version = null;

function getPackageJsonVersion () {
  // We parse the json file instead of using require because require caches
  // multiple calls so the version number won't be updated
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

// The default task, run it using `gulp`
// Converts source to ES5 and creates a minified version and builds to dist
gulp.task('build', function() {
  return gulp.src(source)
    // First convert it to ecma2015
    .pipe(babel({
      presets: ['env']
    }))
    // Add a non minified version to the dist
    .pipe(gulp.dest(destination))
    .pipe(minify())
    // If there is an error during minification this will pretty print to the console
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    // Then we can adjust the extension include min
    .pipe(rename({ extname: '.min.js' }))
    // Then we output to the destination
    .pipe(gulp.dest(destination));
});

// Add the new version to the changelog
gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
  .pipe(conventionalChangelog({
    preset: 'atom'
  }))
  .pipe(gulp.dest('./'));
});

// Ensure you duplicated the .env-sample and set your own GitHub token and renamed it .env
// Create a convention github release
gulp.task('github-release', function(done) {
  env({file: ".env.json"});
  gutil.log(gutil.colors.blue('[github]'), 'Pushing to github using authtoken: '+process.env.GITHUB_AUTH_KEY);
  conventionalGithubReleaser({
    type: "oauth",
    token: process.env.GITHUB_AUTH_KEY
  }, {
    preset: 'atom'
  }, done);
});

gulp.task('bump-version', function () {
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: type}).on('error', gutil.log))
    .pipe(gulp.dest('./'))
    .pipe(tap(function(file){
      var json = JSON.parse(String(file.contents));
      version = json.version;
    }));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('['+type+'] version: '+ version));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });
});

gulp.task('lint', function() {
  return gulp.src(source)
    .pipe(eslint({
      envs: ['node', 'browser']
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('license', function() {
  gulp.src('./LICENSE')
    .pipe(bump())
    .pipe(gulp.dest('./'));
  gulp.src('./src/ajaxinate.js')
    .pipe(bump())
    .pipe(gulp.dest('./src/'));
});

gulp.task('release', function (callback) {
  if (
    args.type === 'minor' ||
    args.type === 'major' ||
    args.type === 'prerelease'
  ) {
    type = args.type;
  }
  runSequence(
    'lint',
    'bump-version',
    'license',
    'changelog',
    'build',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    'github-release',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task('testrelease', function (callback) {
  runSequence(
    'lint',
    'log'
  )
});
gulp.task('log', function (callback) {
  if(
    args.type === 'minor' ||
    args.type === 'major' ||
    args.type === 'prerelease'
  ) {
    type = args.type;
  }

  gutil.log(args.type);
  gutil.log(type);
});
