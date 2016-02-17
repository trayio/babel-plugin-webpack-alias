'use strict';

require('./this/is/a.js');
require('./b.less');
require('./and/a/file.css');

var test = require('./this/is/a.js');
var test2 = require('./');
var test3 = require('my-root-folder-lib-test/and/a/file.css');

// Rest of the file