var loader_css_modern = async (resource, options) => {
    //
    const url =
        resource instanceof Blob ? URL.createObjectURL(resource) : resource;

    //
    const sheet = new CSSStyleSheet();

    //
    await sheet.replace(`@import url("${url}")`);

    //
    URL.revokeObjectURL(url);

    //
    const element = options?.element || document;

    //
    if (element instanceof Document || element instanceof ShadowRoot) {
        element.adoptedStyleSheets = [...element.adoptedStyleSheets, sheet];
    }

    //
    return sheet;
};

export default loader_css_modern;
//# sourceMappingURL=loader.css.modern.es.js.map
