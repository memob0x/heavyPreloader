export default async (blob, el = document) => {
    //
    const url = URL.createObjectURL(blob);

    //
    const sheet = new CSSStyleSheet();

    //
    await sheet.replace(`@import url("${url}")`);

    //
    URL.revokeObjectURL(url);

    //
    if ("adoptedStyleSheets" in el) {
        el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
    }

    //
    return sheet;
};
