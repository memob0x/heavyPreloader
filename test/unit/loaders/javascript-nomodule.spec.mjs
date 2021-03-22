import { getURL } from '../../../src/utils.mjs';
import Fetch from '../../../src/fetch.mjs';
import Load from '../../../src/load.mjs';
import javascript from '../../../src/loaders/javascript-nomodule.mjs';

describe('loaders/javascript-nomodule', () => {
    const lfetch = new Fetch();
    const lload = new Load();
    lload.register('javascript', javascript);    

    it('should return a promise which resolves to a script element', async () => {
        const path = '/base/test/resources/javascript.global.js';

        delete window.foo;
        expect(window).not.to.have.property('foo');

        const blob = await lfetch.fetch(getURL(path).href);
        const script = await lload.load(blob);

        expect(script).to.be.an.instanceof(HTMLScriptElement);

        return script;
    });
});
