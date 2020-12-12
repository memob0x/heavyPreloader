import readBlobAsText from "./text.mjs";

/**
 * 
 */
export default async (blob, options) => {
    //
    let result = await readBlobAsText(blob);

    //
    const sheet = new CSSStyleSheet();

    //
    await sheet.replace(result);

    //
    const element = options?.element;

    //
    if (element instanceof Document || element instanceof ShadowRoot) {
        element.adoptedStyleSheets = [...element.adoptedStyleSheets, sheet];
    }

    //
    return sheet;
};
