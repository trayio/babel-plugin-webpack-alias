'use strict';

require('../assets/le-test-lib/this/is/a.js');
require('../assets/le-test-lib/b.less');
require('../assets/le-test-lib/and/a/file.css');

require('./my-relative-test-lib/this/is/a.js');
require('test/my-relative-test-lib/b.less');

// Rest of the file