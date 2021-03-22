import { getURL } from '../../src/utils.mjs';
import Loader from '../../src/loader.mjs';
import image from '../../src/loaders/image.mjs';

describe('loader', () => {
    const instance = new Loader();
    instance.register('image', image);

    it('constructor should expose load and fetch methods', (done) => {
        expect(instance).to.respondTo('load');
        expect(instance).to.respondTo('fetch');
        expect(instance).to.respondTo('register');

        done();
    });

    // TODO: refactor the following tests to make it more DRY

    describe('fetch public method', () => {
        it('should be able to handle an url object', async () => {
            const fetch = await instance.fetch(
                getURL('/base/test/resources/image.1440x900.jpg')
            );

            expect(fetch).to.be.an.instanceof(Blob);
            expect(fetch).to.have.property('type', 'image/jpeg');

            return fetch;
        });

        it('should be able to lists of url objects', async () => {
            const fetch = await instance.fetch([
                getURL('/base/test/resources/image.1440x900.jpg'),
                getURL('/base/test/resources/image.1440x900.jpg')
            ]);

            expect(fetch).to.be.an('array');

            const first = await fetch[0];
            expect(first).to.be.an.instanceof(Blob);
            expect(first).to.have.property('type', 'image/jpeg');

            const second = await fetch[0];
            expect(second).to.be.an.instanceof(Blob);
            expect(second).to.have.property('type', 'image/jpeg');

            return Promise.allSettled(fetch);
        });

        it('should be able to handle strings', async () => {
            const fetch = await instance.fetch(
                '/base/test/resources/image.1440x900.jpg'
            );

            expect(fetch).to.be.an.instanceof(Blob);
            expect(fetch).to.have.property('type', 'image/jpeg');

            return fetch;
        });

        it('should be able to handle lists of strings', async () => {
            const fetch = await instance.fetch([
                '/base/test/resources/image.1440x900.jpg',
                '/base/test/resources/image.1440x900.jpg'
            ]);

            expect(fetch).to.be.an('array');

            const first = await fetch[0];
            expect(first).to.be.an.instanceof(Blob);
            expect(first).to.have.property('type', 'image/jpeg');

            const second = await fetch[0];
            expect(second).to.be.an.instanceof(Blob);
            expect(second).to.have.property('type', 'image/jpeg');

            return Promise.allSettled(fetch);
        });
    });

    describe('load public method', () => {
        it('should be able to handle an url object', async () => {
            const load = await instance.load(
                getURL('/base/test/resources/image.1440x900.jpg')
            );

            expect(load).to.be.an.instanceOf(HTMLImageElement);

            return load;
        });

        it('should be able to lists of url objects', async () => {
            const load = await instance.load([
                getURL('/base/test/resources/image.1440x900.jpg'),
                getURL('/base/test/resources/image.1440x900.jpg')
            ]);

            expect(load).to.be.an('array');

            const first = await load[0];
            expect(first).to.be.an.instanceOf(HTMLImageElement);

            const second = await load[0];
            expect(second).to.be.an.instanceOf(HTMLImageElement);

            return Promise.allSettled(load);
        });

        it('should be able to handle strings', async () => {
            const load = await instance.load(
                '/base/test/resources/image.1440x900.jpg'
            );

            expect(load).to.be.an.instanceOf(HTMLImageElement);

            return load;
        });

        it('should be able to handle lists of strings', async () => {
            const load = await instance.load([
                '/base/test/resources/image.1440x900.jpg',
                '/base/test/resources/image.1440x900.jpg'
            ]);

            expect(load).to.be.an('array');

            const first = await load[0];
            expect(first).to.be.an.instanceOf(HTMLImageElement);

            const second = await load[0];
            expect(second).to.be.an.instanceOf(HTMLImageElement);

            return Promise.allSettled(load);
        });
    });
});
