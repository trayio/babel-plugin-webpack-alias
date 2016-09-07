
var path = require('path'); // eslint-disable-line no-var, import/no-commonjs

// eslint-disable-next-line import/no-commonjs
module.exports = [{
    resolve: {
        alias: {
            'my-absolute-test-lib1': path.join(__dirname, 'assets/le-test-lib1'),
        },
    },
}, {
    resolve: {
        alias: {
            'my-absolute-test-lib2': path.join(__dirname, 'assets/le-test-lib2'),
        },
    },
}];
