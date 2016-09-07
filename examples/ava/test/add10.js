import add10 from '../add10';
import test from 'ava';

test('should test add10 without errors', t => {
    t.is(add10(5), 15);
});
