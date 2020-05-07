export default async (resource) => {
    //
    const url = resource instanceof Blob ? URL.createObjectURL(blob) : resource;

    //
    const sheet = await new Promise((resolve) => {
        //
        const link = document.createElement("link");

        //
        link.rel = "stylesheet";
        link.href = url;

        //
        const cb = () => {
            link.removeEventListener("load", cb);
            link.removeEventListener("error", cb);

            resolve(link);
        };

        //
        const sheets = document.styleSheets;
        let i = sheets.length;
        while (i--) {
            if (sheets[i].href === url) {
                cb();
            }
        }

        //
        link.addEventListener("load", cb);
        link.addEventListener("error", cb);

        //
        document.head.append(link);
    });

    //
    URL.revokeObjectURL(url);

    //
    return sheet;
};
