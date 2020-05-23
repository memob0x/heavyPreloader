define(function () { 'use strict';

    var loader_html = async (blob, options) => {
        //
        const reader = new FileReader();

        //
        const promise = new Promise((resolve) =>
            reader.addEventListener("loadend", (buffer) =>
                resolve(buffer.srcElement.result)
            )
        );

        //
        reader.readAsText(blob);

        //
        let result = await promise;

        //
        if (typeof options?.filter === "string" && options?.filter?.length) {
            //
            result = new DOMParser().parseFromString(result, "text/html").body;
            //
            result = [...result.querySelectorAll(options.filter)];
            //
            result = result.length
                ? result.map((x) => x.outerHTML).reduce((x, y) => x + y)
                : result;
        }

        //
        if (
            options?.element instanceof HTMLElement &&
            typeof result === "string" &&
            result?.length
        ) {
            options.element.innerHTML = result;
        }

        //
        return promise;
    };

    return loader_html;

});
//# sourceMappingURL=loader.html.amd.js.map
