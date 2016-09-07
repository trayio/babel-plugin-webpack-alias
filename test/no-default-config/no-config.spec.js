import test from 'ava';
import path from 'path';
import {transformFixture} from '../utils';

test('should throw an error when no config is found', t => {
    t.throws(
        () => transformFixture('basic/absolute.js', {config: 'my-webpack.config.js'}),
        `${path.resolve(__dirname, '../fixtures/basic/absolute.js')}: Cannot find any of these configuration files: my-webpack.config.js, webpack.config.js, webpack.config.babel.js`
    );
});
