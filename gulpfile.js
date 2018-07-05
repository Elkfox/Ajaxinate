'use strict';

// Default gulp modules
const gulp = require('gulp');
const rename = require('gulp-rename'); // Helps rename files or changing extensions
const babelMinify = require("gulp-babel-minify"); // Converts to ES5 before minifying
const gutil = require('gulp-util'); // Helps with debugging

// Additional release gulp modules
const env = require('gulp-env'); // For accessing environment variables
const runSequence = require('run-sequence'); // Runs a sequence of gulp tasks
const conventionalChangelog = require('gulp-conventional-changelog'); // Generates a changelog from git metadata
const conventionalGithubReleaser = require('conventional-github-releaser'); // Make a new release from github metadata
const bump = require('gulp-bump'); // Increases the version number
const git = require('gulp-git'); // Run git functions with gulp
const fs = require('fs'); // For working with the local file system

// Define the location of our build directory
const destination = 'dist/';

// The default task, run it using `gulp`
gulp.task('default', function() {
  return gulp.src('src/focus.js')
    // First will output the non-minified version
    .pipe(gulp.dest(destination))
    // This will convert to ecma5 then minify
    .pipe(babelMinify({
      mangle: {
        keepClassName: true
      }
    }))
    // If there is an error during minification this will pretty print to the console
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    // Then we can adjust the extension include min
    .pipe(rename({ extname: '.min.js' }))
    // Then we output to the destination
    .pipe(gulp.dest(destination));
});

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
    .pipe(bump({type: "patch"}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'changelog',
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
