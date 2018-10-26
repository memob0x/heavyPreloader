import { Mocha, mocha, expect } from './setup.mjs';
import { switchAttributes, copyAttributes, removeAttributes } from '../src/loader.utils.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Utils functions');

// virtual DOM preparation and cleanup
dashboard.beforeAll(function() {
    document.body.innerHTML = '';
});
dashboard.afterAll(function() {
    document.body.innerHTML = '';
});

// tests
// TODO: ...
/* dashboard.addTest(new Mocha.Test('can switch element attribute', function() {}));
dashboard.addTest(new Mocha.Test('copy attributes from element to another element', function() {}));
dashboard.addTest(new Mocha.Test('can remove elements attributes', function() {})); */
