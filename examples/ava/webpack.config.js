var path = require('path');

module.exports = {
    resolve: {
        alias: {
            'alias': path.join(__dirname, 'deep/folder/alias'),
        }
    }
};
