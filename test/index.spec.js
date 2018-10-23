import test from 'ava';
import {transformFixture, readFixture} from './utils';

test('basic require with es6 webpack config', t => {
    const actual = transformFixture('basic/absolute.js', {config: 'test/webpack.config.babel.js'});
    const expected = readFixture('basic/expected.js');
    t.is(actual, expected);
});

test('basic require with the absolute resolve path', t => {
    const actual = transformFixture('basic/absolute.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('basic/expected.js');
    t.is(actual, expected);
});

test('basic require with the relative resolve path', t => {
    const actual = transformFixture('basic/relative.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('basic/relativeExpected.js');
    t.is(actual, expected);
});

test('filename require', t => {
    const actual = transformFixture('filename/source.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('filename/expected.js');
    t.is(actual, expected);
});

test('variable assignment', t => {
    const actual = transformFixture('variables/source.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('variables/expected.js');
    t.is(actual, expected);
});

test('requiring files from the root', t => {
    const actual = transformFixture('rootfolder/source.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('rootfolder/expected.js');
    t.is(actual, expected);
});

test('requiring module from by alternate name', t => {
    const actual = transformFixture('module/source.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('module/expected.js');
    t.is(actual, expected);
});

test('using the import syntax', t => {
    const actual = transformFixture('import/source.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('import/expected.js');

    t.is(actual, expected);
});

test('dont throw an exception if the config is found', t => {
    t.notThrows(() => transformFixture('basic/absolute.js', {
        config: "test/runtime.webpack.config.js",
        findConfig: true,
    }));
});

test('use environment variables for the config path', t => {
    const ORIGINAL_PWD = process.env.PWD;
    process.env.PWD = __dirname;

    const actual = transformFixture('import/source.js', {config: '${PWD}/runtime.webpack.config.js'});
    const expected = readFixture('import/expected.js');

    t.is(actual, expected);
    process.env.PWD = ORIGINAL_PWD;
});

test('works with extensions', t => {
    const actual = transformFixture('extensions/source.js', {config: 'test/extensions.config.js'});
    const expected = readFixture('extensions/expected.js');
    t.is(actual, expected);
});

test('works with libraries targeted with path.resolve', t => {
    const actual = transformFixture('pathresolve/source.js', {config: 'test/runtime.webpack.config.js'});
    const expected = readFixture('pathresolve/expected.js');
    t.is(actual, expected);
});

test('should throw an error when there is no resolve config', t => {
    t.throws(
        () => transformFixture('basic/absolute.js', {config: 'test/no-resolve.config.js'}),
        'The resolved config file doesn\'t contain a resolve configuration'
    );
});

test('should ignore empty object', t => {
    t.notThrows(() => transformFixture('basic/absolute.js', {config: 'test/empty-object.config.js'}));
});

test('works with webpack configs that export an array, instead of a single object (multicompile mode)', t => {
    const actual = transformFixture('multicompile/source.js', {config: 'test/webpack.multicompile.js'});
    const expected = readFixture('multicompile/expected.js');
    t.is(actual, expected);
});

test('doesnt output extensions when noOutputExtension is set to true', t => {
    const actual = transformFixture('no-extension/source.js', {config: 'test/extensions.config.js', noOutputExtension: true});
    const expected = readFixture('no-extension/expected.js');
    t.is(actual, expected);
});
