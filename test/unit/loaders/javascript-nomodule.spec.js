import getAbsoluteUrl from '../../../src/get-absolute-url.js';
import Fetch from '../../../src/fetch.js';
import Load from '../../../src/load.js';
import javascript from '../../../src/loaders/javascript-nomodule.js';

describe('loaders/javascript-nomodule.js', () => {
    const lfetch = new Fetch();
    const lload = new Load();
    lload.register('javascript', javascript);    

    it('should return a promise which resolves to a script element', async () => {
        const path = '/base/test/resources/javascript.global.js';

        delete window.foo;
        expect(window).not.to.have.property('foo');

        const blob = await lfetch.fetch(getAbsoluteUrl(path).href);
        const script = await lload.load(blob);

        expect(script).to.be.an.instanceof(HTMLScriptElement);

        return script;
    });
});
