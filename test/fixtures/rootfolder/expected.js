"use strict";

require("../../../fixtures/this/is/a.js");

require("../../../fixtures/b.less");

require("../../../fixtures/and/a/file.css");

var test = require("../../../fixtures/this/is/a.js");

var test2 = require("../../../fixtures");

var test3 = require('my-root-folder-lib-test/and/a/file.css'); // Rest of the file