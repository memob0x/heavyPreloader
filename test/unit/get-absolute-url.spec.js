import getAbsoluteUrl from '../../src/get-absolute-url.js';

describe('get-absolute-url.js', () => {
    it('should be able to make a URL object out of a relative path with getAbsoluteUrl function', (done) => {
        const path = '/base/test/resources/css.inherit.css';
        const url = getAbsoluteUrl(path);

        expect(url).to.be.an.instanceof(URL);
        expect(url.href).to.equals(`${location.origin}${path}`);

        done();
    });
});
