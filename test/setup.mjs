// dependencies
import Mocha from '../node_modules/mocha/lib/mocha.js';
import chai from '../node_modules/chai/chai.js';
import jsdom from '../node_modules/jsdom/lib/api.js';

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

export { Mocha, mocha, expect };
