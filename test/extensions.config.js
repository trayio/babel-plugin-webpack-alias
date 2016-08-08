
var path = require('path');

module.exports = {
    resolve: {
        alias: {
            'my-absolute-test-lib': path.join(__dirname, 'fixtures/required')
        },
        extensions: ['.jsx', '.coffee', '.js']
    }
};
