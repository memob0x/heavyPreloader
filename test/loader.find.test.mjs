// dependencies load
import { Mocha, mocha, expect } from './setup.mjs';
import { find } from '../src/loader.find.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Resources finder');

// virtual DOM preparation and cleanup
dashboard.beforeAll(function() {
    document.body.innerHTML = '';

    this.imagesURLs = ['http://placehold.it/1x1.jpg', 'http://placehold.it/1x2.jpg'];

    const container = document.createElement('div');
    this.imagesURLs.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        container.append(img);
    });

    document.body.append(container);
});
dashboard.afterAll(function() {
    document.body.innerHTML = '';
});

// tests
dashboard.addTest(
    new Mocha.Test('can find targets inside element', function() {
        const targets = find(document.body);
        expect(targets).to.be.an('array');
        // TODO: expect to be inconsistent, without element, tag = img, extension = jpg
    })
);
// TODO: ...
