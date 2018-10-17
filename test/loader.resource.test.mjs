import { Mocha, mocha, expect } from './setup.mjs';
import { Resource } from '../src/loader.resource.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Resource constructor');

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
// TODO: ...
