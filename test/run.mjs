// set test environment up
import { mocha } from './setup.mjs';

// import all the test cases
import './loader.utils.test.mjs';
import './loader.media.test.mjs';
import './loader.find.test.mjs';
import './loader.collection.test.mjs';
import './loader.load.test.mjs';

// lounch mocha
mocha.run();
