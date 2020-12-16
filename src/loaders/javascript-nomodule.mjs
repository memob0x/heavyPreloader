import genericLoader from './generic.mjs';

/**
 * 
 */
export default async (blob, options) => genericLoader(
    blob,
    options,

    document.head,

    HTMLScriptElement,
    'script', 
    
    ['readystatechange', 'load'],
    [],

    (script, url) => {
        //
        script.async = true;

        //
        script.src = url;
    }
);
