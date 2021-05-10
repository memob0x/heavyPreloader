import download from 'download-chromium';

(async () => {
    console.log('Downloading chromium...');

    await download({
        revision: '869685',
        installPath: './.local-chromium' 
    });
})();
