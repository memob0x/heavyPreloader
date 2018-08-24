const consoleDiv = document.querySelector('#console');
const consoleLog = string => {
    if (!consoleDiv.hasChildNodes()) {
        const ol = document.createElement('ol');
        consoleDiv.append(ol);
    }

    const list = consoleDiv.querySelector('ol');
    const li = document.createElement('li');
    li.innerHTML = string;
    list.append(li);

    consoleDiv.scrollTop = list.offsetHeight;
};
[...document.querySelectorAll('.playground')].forEach(element => {
    const loadInstance = new Loader({
        srcAttr: 'data-src',
        srcsetAttr: 'data-srcset',
        playthrough: false,
        visible: true,
        backgrounds: true,

        playthrough: 'full',

        early: false,
        earlyTimeout: 6000
    });

    loadInstance.collection = element;

    loadInstance.observe();

    loadInstance.load();
});

/*  onComplete: function(instance, resources) {
        $(this).addClass('complete');
    },

    onProgress: function(instance, resource) {
        $(this)
            .find('[data-percentage]')
            .attr('data-percentage', instance.percentage)
            .closest('.playground__percentage')
            .addClass('visible');
    },

    onLoad: function(instance, resource) {
        $(this).addClass('has-loads');
    },
    onError: function(instance, resource) {
        $(this).addClass('has-errors');
    } */

document.addEventListener('resourceLoad', e => {
    consoleLog('Loader() load: ' + e.detail.resource);
});

document.addEventListener('resourceError', e => {
    consoleLog('Loader() error: ' + e.detail.resource);
});

[...document.querySelectorAll('figure img, figure video')].forEach(el => {
    el.addEventListener('resourceLoad', e => e.detail.element.closest('figure').classList.add('loaded'));
    el.addEventListener('resourceError', e => e.detail.element.closest('figure').classList.add('loaded-error'));
});

let instance;
let instanceSequentialMode = true;

document.querySelector('.program-mode--sequential').addEventListener('click', () => {
    if (instance !== null) {
        return;
    }

    document.querySelector('.program-mode--parallel').style.display = 'block';
    document.querySelector('.program-mode--sequential').style.display = 'none';

    instanceSequentialMode = true;
    consoleLog('Loader(): Sequential Mode');
});

document.querySelector('.program-mode--parallel').addEventListener('click', () => {
    if (instance !== null) {
        return;
    }

    document.querySelector('.program-mode--sequential').style.display = 'block';
    document.querySelector('.program-mode--parallel').style.display = 'none';

    instanceSequentialMode = false;
    consoleLog('Loader(): Parallel Mode');
});

[...document.querySelectorAll('[class*="program-load"]')].forEach(el =>
    el.addEventListener('click', () => {
        if (instance) {
            consoleLog('Loader(): Aborted...');

            instance.abort();
            instance = null;

            document.querySelector('.program-load--run').style.display = 'block';
            document.querySelector('.program-load--kill').style.display = 'none';
        } else {
            document.querySelector('.program-load--run').style.display = 'none';
            document.querySelector('.program-load--kill').style.display = 'block';

            let randomResources = [];

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

                randomResources.push('//placehold.it/720x720/' + colors[0] + '/' + colors[1] + '.jpg');
            }

            instance = new Loader({
                sequential: instanceSequentialMode
            });

            instance.collection = randomResources;

            consoleLog('Loader(): 0% - Starting...');

            instance.progress(resource => {
                consoleLog('Loader(): ' + instance.percentage + '%');
            });

            instance.done(resources => {
                consoleLog('Loader(): 100% - Done!!');
                document.querySelector('.program-load--run').style.display = 'block';
                document.querySelector('.program-load--kill').style.display = 'none';

                instance = null;
            });

            instance.load();
        }
    })
);
