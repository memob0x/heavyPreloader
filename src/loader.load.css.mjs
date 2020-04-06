export default async (blob, options) => {
    //
    options = { ...{ element: document }, options };

    //
    const url = URL.createObjectURL(blob);

    //
    const sheet = new CSSStyleSheet();

    //
    await sheet.replace(`@import url("${url}")`);

    //
    URL.revokeObjectURL(url);

    //
    if ("adoptedStyleSheets" in options.element) {
        options.element.adoptedStyleSheets = [
            ...options.element.adoptedStyleSheets,
            sheet,
        ];
    }

    //
    return sheet;
};
