/*
 * When testing with Webpack and TS, we have to do some
 * preliminary setup. Because we are writing our tests also in TS,
 * we must transpile those as well, which is handled inside
 * `karma.conf.js` via the `karma-webpack` plugin. This is the entry
 * file for the Webpack tests. Similarly to how Webpack creates a
 * `bundle.js` file for the compressed app source files, when we
 * run our tests, Webpack, likewise, compiles and bundles those tests here.
*/

import angular from 'angular';
import mocks from 'angular-mocks';
import toastr from 'angular-toastr';
import 'angular-messages';

// We use the context method on `require` which Webpack created
// in order to signify which files we actually want to require or import.
// Below, `context` will be a/an function/object with file names as keys.
// Using that regex, we scan within ./src/app` and target
// all files ending with `.spec.ts` and trace its path.
// By passing in true, we permit this process to occur recursively.
let context = require.context('./src/app', true, /\.spec\.ts/);

// Get all files, for each file, call the context function
// that will require the file and load it here. Context will
// loop and require those spec files here.
context.keys().forEach(context);
