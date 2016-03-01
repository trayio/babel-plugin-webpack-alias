
const babel = require('babel-core');
import test from 'ava';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function transformFile(path, configuration = { config: './runtime.webpack.config.js' }) {
    return babel.transformFileSync(resolve(__dirname, path), {
        plugins: [
            ['../src/index.js', configuration]
        ]
    });
}

function read(path) {
    return readFileSync(resolve(__dirname, path), 'utf8');
}

test('basic require with the absolute resolve path', t => {
    const actual = transformFile('fixtures/basic.absolute.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/basic.expected.js');
    t.is(actual, expected);
});

test('basic require with the relative resolve path', t => {
    const actual = transformFile('fixtures/basic.relative.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/basic.expected.js');
    t.is(actual, expected);
});

test('filename require', t => {
    const actual = transformFile('fixtures/filename.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/filename.expected.js');
    t.is(actual, expected);
});

test('variable assignment', t => {
    const actual = transformFile('fixtures/variables.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/variables.expected.js');
    t.is(actual, expected);
});

test('requiring files from the root', t => {
    const actual = transformFile('fixtures/rootfolder.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/rootfolder.expected.js');
    t.is(actual, expected);
});


test('using the import syntax', t => {
    const actual = transformFile('fixtures/import.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/import.expected.js');

    t.is(actual, expected);
});
