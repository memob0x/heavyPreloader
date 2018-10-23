import Loader from '../../../../src/loader.mjs';
import { log } from '../main.js';

const pageLoader = new Loader({
    lazy: true,
    playthrough: true,
    backgrounds: true
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

            log('Total page load: ' + pageLoader.percentage + '% ' + e.resource.url, e);
        });
        pageLoad.catch(error => console.log(error)).then(e => log('All done!'));
    },
    false
);

document.querySelectorAll('img').forEach(img => img.addEventListener('resourceError', e => e.detail.resource.element.classList.add('missing')));
