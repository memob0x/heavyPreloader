(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    var loader_load_html = async (blob, options) => {
        const reader = new FileReader();

        const promise = new Promise((resolve) =>
            reader.addEventListener("loadend", (buffer) =>
                resolve(buffer.srcElement.result)
            )
        );

        reader.readAsText(blob);

        let result = await promise;

        if (
            options &&
            typeof options.filter === "string" &&
            options.filter.length
        ) {
            result = new DOMParser().parseFromString(result, "text/html").body;
            result = [...result.querySelectorAll(options.filter)];
            result = result.length
                ? result.map((x) => x.outerHTML).reduce((x, y) => x + y)
                : result;
        }

        if (
            options &&
            options.element &&
            options.element instanceof HTMLElement &&
            result &&
            typeof result === "string" &&
            result.length
        ) {
            options.element.innerHTML = result;
        }

        return promise;
    };

    return loader_load_html;

})));

//# sourceMappingURL=loader.load.html.js.map
