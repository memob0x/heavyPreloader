var loader_javascript = async (blob) => {
    //
    const url = URL.createObjectURL(blob);

    //
    const result = await import(url);

    //
    URL.revokeObjectURL(url);

    //
    return result;
};

export default loader_javascript;
//# sourceMappingURL=loader.javascript.es.js.map
