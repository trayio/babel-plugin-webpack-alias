
import path from 'path';

export default {
    resolve: {
        alias: {
            'my-absolute-test-lib': path.join(__dirname, 'assets/le-test-lib'),
            'same-folder-lib': path.resolve(__dirname, 'fixtures/basic'),
        }
    }
};
