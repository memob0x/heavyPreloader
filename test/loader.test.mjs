// dependencies
import Mocha from '../node_modules/mocha/lib/mocha.js';
import chai from '../node_modules/chai/chai.js';
import jsdom from '../node_modules/jsdom/lib/api.js';
import Loader from '../src/loader.mjs';
// test initialization and assertions definition
const expect = chai.expect;
const mocha = new Mocha({
    reporter: 'spec'
});
// virtual dom creation
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.document = dom;
global.window = dom.window;
global.HTMLElement = global.window.HTMLElement;

// tests
// TODO: all the tests, duh!
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

mocha.run();
