import test from 'ava';
import {transformFixture} from '../utils';

test('should throw an error when no config is found', t => {
    t.throws(
        () => transformFixture('basic/absolute.js', {config: 'test/my-webpack.config.js'}),
        'Cannot find any of these configuration files: test/my-webpack.config.js, webpack.config.js, webpack.config.babel.js'
    );
    t.is(1, 1);
});
