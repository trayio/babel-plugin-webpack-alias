import { readFileSync } from 'fs';
import { resolve } from 'path';
const babel = require('@babel/core'); // eslint-disable-line import/no-commonjs

const plugin = resolve(__dirname, '../src/index.js');

export function transformFixture(name, configuration) {
    return babel.transformFileSync(resolve(__dirname, 'fixtures', name), {
        plugins: [
            configuration ? [plugin, configuration] : plugin,
        ],
    }).code;
}

export function readFixture(name) {
    return readFileSync(resolve(__dirname, 'fixtures', name), 'utf8');
}
