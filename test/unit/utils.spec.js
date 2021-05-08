



import { expect } from 'chai';

import { getURL } from '../../src/utils.js';

describe('utils', () => {
    it('should be able to make a URL object out of a relative path with getURL function', (done) => {
        const path = 'http://localhost:8080/resources/css.inherit.css';
        const url = getURL(path);

        expect(url).to.be.an.instanceof(URL);
        expect(url.href).to.equals(`${location.origin}${path}`);

        done();
    });
});
