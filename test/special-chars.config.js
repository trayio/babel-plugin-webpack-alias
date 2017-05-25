var path = require('path');

module.exports = {
    resolve: {
        alias: {
            '\\ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] "': path.resolve(__dirname, 'yolo/trolo'),
        }
    }
};

