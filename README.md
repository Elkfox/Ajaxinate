[![Build Status](https://travis-ci.org/Elkfox/Ajaxinate.svg?branch=master)](https://travis-ci.org/Elkfox/Ajaxinate)

# Ajaxinate
Ajax pagination plugin for Shopify themes.

<a href="https://elkfox.github.io/Ajaxinate/" target="_blank">View the demo and documentation to get started</a>


### Development

Run npm install to add all of the dependencies

Ajaxinate is compiled using gulp. The src file is located in `src/ajaxinate.js` and built into `/dist`. Gulp is setup to lint the source with the airbnb style guide. Transpile the code using babel from ES6 to ES5 for best browser support. Create git semantic versioning (semver) releases, with automatic changelog creation.

Ajaxinate uses Atom conventional commit messages to automatically create a changelog so it is important that your commit messages comply to this standard:
https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-atom

#### Commands

`npm test`
Lint the code using the airbnb style guide and return any errors or warnings. If any changes are pushed to the master repository without first being tested the build will not pass the Travis CI tests.

`npm build`
Compile the code to es5 and build a minified and an unminified version to the dist directory.

`npm release [type]`
To use the release command correctly you first need to setup your env correctly. See Setting up your env for more info.

Running `npm release` without any arguments will default to releasing it as a patch which should only be used for releasing backward compatible bug fixes.


`[type]`
 - `minor` - MINOR version when you add functionality in a backwards-compatible manner
 - `major` - MAJOR version when you make incompatible API changes,
 - `prerelease` - A pre-release version indicates that the version is unstable and might not satisfy the intended compatibility requirements as denoted by its associated normal version.

Refer to https://semver.org/ for more information on release arguments

### Setting up your env
To create a github release you first need to duplicate the `.env-sample.json` and rename it `.env.json`. The `.env.json` file should never be commited as we be adding an a github private key to it. You can create a private key by following the link in the sample env. Don't forget to remove the comment from your env.

### License

The code is available under an MIT License.
