import Loader from '../../../../src/loader.mjs';
import { log } from '../main.js';

const pageLoader = new Loader({
    playthrough: true,
    backgrounds: true,
    sequential: false
});

pageLoader.collection = document.querySelectorAll('.playground');

window.addEventListener(
    'load',
    () => {
        const pageLoad = pageLoader.load();

        pageLoad.progress(e => {
            if (!e.resource.element) {
                return;
            }

            const container = e.resource.element.matches('.playground') ? e.resource.element : e.resource.element.closest('.playground');
            const percentage = container.querySelector('.playground__percentage');
            const item = e.resource.element.closest('.playground__item');

            if (percentage) {
                percentage.classList.add('visible');
            }

            if (item) {
                e.resource.element.closest('.playground__item').classList.add('loaded');
            }

            if (percentage) {
                percentage.children[0].dataset.percentage =
                    (container.querySelectorAll('.playground__item.loaded').length / container.querySelectorAll('.playground__item').length) * 100;
            }

            document.querySelector('#preloader').innerHTML = pageLoader.percentage + '%';

            log('Total page load: ' + pageLoader.percentage + '% ' + e.resource.url);
        });
        pageLoad
            .catch(error => log(error))
            .then(() => {
                document.querySelector('#preloader').innerHTML = 'done!';
                setTimeout(() => document.body.classList.add('loaded'), 500);
                log('All done!');
            });
    },
    false
);

document.querySelectorAll('img').forEach(img => img.addEventListener('resourceError', e => e.detail.resource.element.classList.add('missing')));
