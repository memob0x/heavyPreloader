import blobText from "../utils/blob.text.mjs";

/**
 * 
 */
export default async (blob, options) => {
    //
    let result = await blobText(blob);

    //
    const sheet = new CSSStyleSheet();

    //
    await sheet.replace(result);

    //
    const element = options?.element || document;

    //
    if (element instanceof Document || element instanceof ShadowRoot) {
        element.adoptedStyleSheets = [...element.adoptedStyleSheets, sheet];
    }

    //
    return sheet;
};
