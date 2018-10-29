import { Mocha, mocha, expect } from './setup.mjs';
import { Resource } from '../src/loader.resource.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Resource constructor');

// virtual DOM preparation and cleanup
dashboard.beforeAll(function() {
    document.body.innerHTML = '';
});
dashboard.afterAll(function() {
    document.body.innerHTML = '';
});
// tests
dashboard.addTest(
    new Mocha.Test('can create a resource object form image url', function() {
        const resource = new Resource({
            url: 'http://placehold.it/1x1.jpg'
        });
        expect(resource).to.be.an('object');
        // TODO: expect to be inconsistent, without element, tag = img, extension = jpg
    })
);
// TODO: can build Resource obj from image url
// TODO: can build Resource obj from video url
// TODO: can build Resource obj from audio url
// TODO: can build Resource obj from page url (???)
// TODO: can build Resource obj from img el
// TODO: can build Resource obj from picture el
// TODO: can build Resource obj from video el
// TODO: can build Resource obj from audio el
// TODO: can build Resource obj from iframe el
