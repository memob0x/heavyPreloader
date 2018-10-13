import { Mocha, mocha, expect } from './setup.mjs';
import Loader from '../src/loader.mjs';

const mainClassTests = Mocha.Suite.create(mocha.suite, 'Main Class');
mainClassTests.beforeAll(function() {
    this.instance = new Loader();
});
mainClassTests.afterAll(function() {
    this.instance = null;
});
mainClassTests.addTest(
    new Mocha.Test('can read/read from "collection" getter/setter', function() {
        const url = '//placehold.it/220x220.jpg';
        this.instance.collection = [url];
        expect(this.instance.collection)
            .to.be.an('array')
            .that.does.not.include(url);
    })
);
