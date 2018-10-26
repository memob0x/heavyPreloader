// dependencies load
import { Mocha, mocha, expect, dummyContents } from './setup.mjs';
import { find } from '../src/loader.find.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Resources finder');

// virtual DOM preparation and cleanup
dashboard.beforeAll(function() {
    document.body.innerHTML = '';

    const container = document.createElement('div');
    dummyContents.images.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        container.append(img);
    });

    document.body.append(container);

    const background = document.createElement('div');
    background.style.backgroundImage = 'url(' + dummyContents.images + ')';
    background.id = 'background';
    document.body.append(background);
});
dashboard.afterAll(function() {
    document.body.innerHTML = '';
});

// tests
dashboard.addTest(
    new Mocha.Test('can find targets inside element', function() {
        const targets = find(document.body, { backgrounds: false });
        // TODO: expect to be consistent, with element, tag = img, extension = jpg
        expect(targets).to.be.an('array');
    })
);
dashboard.addTest(
    new Mocha.Test('can find backgrounds inside element', function() {
        const targets = find(document.querySelector('#background'), { background: true });
        // TODO: expect to be inconsistent, without element, tag = img, extension = jpg
        expect(targets).to.be.an('array');
    })
);
// TODO: ...
