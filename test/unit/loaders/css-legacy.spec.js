import { getURL } from '../../../src/utils.js';
import Fetch from '../../../src/fetch.js';
import Load from '../../../src/load.js';
import css from '../../../src/loaders/css-legacy.js';

describe('loaders/css-legacy', () => {
    const lfetch = new Fetch();
    const lload = new Load();
    lload.register('css', css);

    it('should return a promise which resolves to a HTMLLinkElement object', async () => {
        const path = '/base/test/resources/css.inherit.css';

        const blob = await lfetch.fetch(getURL(path).href);
        const stylesheet = await lload.load(blob, { element: document.createElement('link') });

        expect(stylesheet).to.be.an.instanceof(HTMLLinkElement);

        return stylesheet;
    });

    it('should attach stylesheet to document if no different option is specified', async () => {
        const path = '/base/test/resources/css.blue-background.css';
        const getBodyBackgroundColor = () => getComputedStyle(document.body).backgroundColor;

        expect(getBodyBackgroundColor()).to.equals('rgba(0, 0, 0, 0)');

        const blob = await lfetch.fetch(getURL(path).href);
        const stylesheet = await lload.load(blob, { element: document.createElement('link') });

        expect(getBodyBackgroundColor()).to.equals('rgb(0, 0, 255)');

        stylesheet.remove();

        return stylesheet;
    });
});
