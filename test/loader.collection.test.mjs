// dependencies load
import { Mocha, mocha, expect, dummies } from './setup.mjs';
import Loader from '../src/loader.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Loader collection method');

// virtual DOM preparation and cleanup
dashboard.beforeAll(function() {
    document.body.innerHTML = '';

    dummies.append.imgs();

    dummies.append.background();
});
dashboard.afterAll(function() {
    document.body.innerHTML = '';
});

// tests
dashboard.addTest(
    new Mocha.Test('can retrieve the current collection', function() {
        const instance = new Loader();
        expect(instance.collection).to.be.an('array');
    })
);
dashboard.addTest(
    new Mocha.Test('can add a resource url to collection', function() {
        const instance = new Loader();
        const url = dummies.urls.images[0];

        instance.collection = url;

        expect(instance.collection[0]).to.deep.include({ url: url });
    })
);
dashboard.addTest(
    new Mocha.Test('can add an array of urls to collection', function() {
        const instance = new Loader();
        const array = dummies.urls.images;

        instance.collection = array;

        expect(instance.collection[0]).to.deep.include({ url: array[0] }) && expect(instance.collection[1]).to.deep.include({ url: array[1] });
    })
);
dashboard.addTest(
    new Mocha.Test('can add an image element to collection', function() {
        const instance = new Loader();
        const target = document.querySelector('img');

        instance.collection = target;

        expect(instance.collection[0]).to.deep.include({ url: target.src });
    })
);
dashboard.addTest(
    new Mocha.Test('can add a NodeList of images to collection', function() {
        const instance = new Loader();
        const targets = document.querySelectorAll('img');

        instance.collection = targets;

        expect(instance.collection.length).to.equals(targets.length);
    })
);
dashboard.addTest(
    new Mocha.Test('can discover inner resource elements on collection set', function() {
        const instance = new Loader();
        const targets = document.querySelector('.images');

        instance.collection = targets;

        expect(instance.collection.length).to.equals(targets.children.length);
    })
);
dashboard.addTest(
    new Mocha.Test('can discover image backgrounds on collection set', function() {
        const instance = new Loader({
            backgrounds: true
        });

        instance.collection = document.querySelector('.background');

        expect(instance.collection[0]).to.deep.include({ url: dummies.urls.images[0] });
    })
);
