var test = require('my-relative-test-lib/this/is/a.js');
var test2 = require('my-relative-test-lib/b.less');
var test3 = require('my-relative-test-lib/and/a');

var test4 = require('./my-relative-test-lib/this/is/a.js');
var test5 = require('test/my-relative-test-lib/b.less');

var test6 = require('my-relative-test-lib-test/this/is/a.js');
var test7 = require('my-relative-test-lib-test/b.less');
var test8 = require('my-relative-test-lib-test/and/a');

var test9 = require('my-relative-test-lib');
var test10 = require('my-relative-test-lib-test');

// Rest of the file
