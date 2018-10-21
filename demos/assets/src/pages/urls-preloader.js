import Loader from '../../../../src/loader.mjs';
import { log } from '../main.js';

const testLoader = new Loader({
    sequential: true
});

document.querySelector('button.load').addEventListener('click', e => {
    testLoader.collection = (() => {
        let imgs = [];

        for (let i = 0; i < 10; i++) {
            let letters = '0123456789ABCDEF',
                colors = [];

            for (let ii = 0; ii < 2; ii++) {
                let color = '';
                for (let c = 0; c < 6; c++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                colors[ii] = color;
            }

            imgs.push('//placehold.it/720x720/' + colors[0] + '/' + colors[1] + '.jpg');
        }

        return imgs;
    })();

    const testLoad = testLoader.load();

    testLoad
        .progress(e => log('Total programmatic load percentage: ' + testLoader.percentage + '% ' + e.resource.url))
        .catch(e => {
            log(e);
        })
        .then(() => log('All done, loader finished processing resources...'));
});

document.querySelector('button.abort').addEventListener('click', e => testLoader.abort());
