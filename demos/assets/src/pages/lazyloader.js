import Loader from '../../../../src/loader.js';
import { log } from '../main.js';

const pageLoader = new Loader({
    lazy: true,
    playthrough: true,
    backgrounds: true
});

[...document.querySelectorAll('.playground')].forEach(element => (pageLoader.collection = element));

const pageLoad = pageLoader.load();

pageLoad.progress(e => {
    if (!e.element) {
        return;
    }

    const container = e.element.matches('.playground') ? e.element : e.element.closest('.playground');
    const percentage = container.querySelector('.playground__percentage');
    const item = e.element.closest('.playground__item');

    if (percentage) {
        percentage.classList.add('visible');
    }

    if (item) {
        e.element.closest('.playground__item').classList.add('loaded');
    }

    if (percentage) {
        percentage.children[0].dataset.percentage = (container.querySelectorAll('.playground__item.loaded').length / container.querySelectorAll('.playground__item').length) * 100;
    }

    log('Total page load: ' + pageLoader.percentage + '% ' + e.url);
});
pageLoad.then(e => log('All done, this page has completely loaded!', e));
pageLoad.catch(error => console.log('Error', error));
