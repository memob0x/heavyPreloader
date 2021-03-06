import getAbsoluteUrl from '../../src/get-absolute-url.js';
import Fetch from '../../src/fetch.js';

describe('fetch.js', () => {
    const path = '/base/test/resources/css.inherit.css';
    const url = getAbsoluteUrl(path).href;
    const lfetch = new Fetch();

    it('should return a promise which resolves to a resource blob object', () => {
        const success = lfetch.fetch(url);
        success.then((x) => expect(x).to.be.an.instanceof(Blob));

        const error = lfetch.fetch(path);
        error.catch((x) => expect(x).to.be.an.instanceof(Error));

        return Promise.allSettled([success, error]);
    });

    it('should return a cached promise when a resource has already been fetched', async () => {
        expect(lfetch.cache).to.have.property(url);

        const value = 'ok';

        const promise = Promise.resolve(value);

        lfetch.cache[url] = promise;

        const result = await lfetch.fetch(url);

        expect(result).to.equals(value);

        lfetch.clear();

        return promise;
    });
});
