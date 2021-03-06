import getAbsoluteUrl from '../../../src/get-absolute-url.js';
import Fetch from '../../../src/fetch.js';
import Load from '../../../src/load.js';
import image from '../../../src/loaders/image.js';

describe('loaders/image.js', () => {
    const lfetch = new Fetch();
    const lload = new Load();
    lload.register('image', image);

    it('should return a promise which resolves to an element', async () => {
        const path = '/base/test/resources/image.1440x900.jpg';

        const blob = await lfetch.fetch(getAbsoluteUrl(path).href);
        const element = await lload.load(blob);

        expect(element).to.be.an.instanceof(HTMLImageElement);

        return element;
    });

    it('should attach resource to a non existent image element if no other image element is provied in options', async () => {
        const path = '/base/test/resources/image.1440x900.jpg';
        const el = new Image();

        expect(el.naturalHeight).to.equals(0);

        const blob = await lfetch.fetch(getAbsoluteUrl(path).href);
        const element = await lload.load(blob, { element: el });

        expect(el.naturalHeight).to.equals(900);

        return element;
    });
});
