require('my-relative-test-lib/this/is/a.js');
require('my-relative-test-lib/b.less');
require('my-relative-test-lib/and/a/file.css');

require('./my-relative-test-lib/this/is/a.js');
require('test/my-relative-test-lib/b.less');

require('my-relative-test-lib-test/this/is/a.js');
require('my-relative-test-lib-test/b.less');
require('my-relative-test-lib-test/and/a/file.css');

// Rest of the file
