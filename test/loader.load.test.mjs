import { Mocha, mocha, expect } from './setup.mjs';
import Loader from '../src/loader.mjs';

const dashboard = Mocha.Suite.create(mocha.suite, 'Load class main workflow');

// virtual DOM preparation and cleanup
dashboard.beforeAll(function () {
    document.body.innerHTML = '';
});
dashboard.afterAll(function () {
    document.body.innerHTML = '';
});

// tests
// TODO: ...
