var loader_javascript_modules = async (resource) => {
    //
    const url =
        resource instanceof Blob ? URL.createObjectURL(resource) : resource;

    //
    const result = await import(url);

    //
    URL.revokeObjectURL(url);

    //
    return result;
};

export default loader_javascript_modules;
//# sourceMappingURL=loader.javascript.modules.es.js.map
