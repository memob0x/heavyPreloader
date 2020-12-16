import genericLoader from './generic.mjs';

/**
 * 
 */
export default async (blob, options) => genericLoader(
    blob,
    options,
    
    document.head,
    
    HTMLLinkElement,
    'link',

    ['load'],
    ['error'],

    (link, url, success) => {
        //
        link.rel = "stylesheet";

        //
        link.href = url;

        //
        const sheets = document.styleSheets;
        let i = sheets.length;
        while (i--) {
            if (sheets[i].href === url) {
                success();
            }
        }
    }
);
