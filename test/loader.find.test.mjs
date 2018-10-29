// dependencies load
import { Mocha, mocha, expect, dummies } from './setup.mjs';
import { find } from '../src/loader.find.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Resources finder');

// virtual DOM preparation and cleanup
dashboard.beforeAll(function() {
    document.body.innerHTML = '';

    dummies.append.imgs();
    dummies.append.pictures();
    dummies.append.audios();
    dummies.append.videos();
    dummies.append.background();
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
        const targets = find(document.querySelector('.background'), { background: true });
        // TODO: expect to be inconsistent, without element, tag = img, extension = jpg
        expect(targets).to.be.an('array');
    })
);
// TODO: expect to find picture
// TODO: expect to find audio
// TODO: expect to find video
// TODO: expect to find iframe
