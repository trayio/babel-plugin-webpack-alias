import add10 from '../add10';
import { expect } from 'chai';

describe('alias test', () => {
    it('should test add10 without errors', () => {
        expect(add10(5)).to.equal(15);
    });
});