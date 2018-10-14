// dependencies load
import { Mocha, mocha, expect } from './setup.mjs';
import Loader from '../src/loader.mjs';

const testCase = Mocha.Suite.create(mocha.suite, 'Collection method');

// virtual DOM preparation and cleanup
testCase.beforeAll(function() {
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
testCase.afterAll(function() {
    document.body.innerHTML = '';
});

// tests
testCase.addTest(
    new Mocha.Test('can retrieve the current collection', function() {
        const instance = new Loader();
        expect(instance.collection).to.be.an('array');
    })
);
testCase.addTest(
    new Mocha.Test('can add a media url to collection', function() {
        const instance = new Loader();
        const url = this.imagesURLs[0];

        instance.collection = url;

        expect(instance.collection[0]).to.deep.include({ url: url });
    })
);
testCase.addTest(
    new Mocha.Test('can add an array of urls to collection', function() {
        const instance = new Loader();
        const array = this.imagesURLs;

        instance.collection = array;

        expect(instance.collection[0]).to.deep.include({ url: array[0] }) && expect(instance.collection[1]).to.deep.include({ url: array[1] });
    })
);
testCase.addTest(
    new Mocha.Test('can add an image element to collection', function() {
        const instance = new Loader();
        const target = document.querySelector('img');

        instance.collection = target;

        expect(instance.collection[0]).to.deep.include({ url: target.src });
    })
);
testCase.addTest(
    new Mocha.Test('can add a NodeList of images to collection', function() {
        const instance = new Loader();
        const targets = document.querySelectorAll('img');

        instance.collection = targets;

        expect(instance.collection.length).to.equals(targets.length);
    })
);
testCase.addTest(
    new Mocha.Test('can discover inner media elements on collection set', function() {
        const instance = new Loader();
        const targets = document.querySelector('div');

        instance.collection = targets;

        expect(instance.collection.length).to.equals(targets.children.length);
    })
);
testCase.addTest(
    new Mocha.Test('can discover image backgrounds on collection set', function() {
        const instance = new Loader({
            backgrounds: true
        });
        const target = document.createElement('div');
        target.style.backgroundImage = 'url(' + this.imagesURLs[0] + ')';

        instance.collection = target;

        expect(instance.collection[0]).to.deep.include({ url: this.imagesURLs[0] });
    })
);
