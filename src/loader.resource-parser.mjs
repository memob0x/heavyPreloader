const SupportedFileExtensions = {
    IMAGE: [
        "jp[e]?g",
        "jpe",
        "jif",
        "jfif",
        "jfi",
        "gif",
        "png",
        "tif[f]?",
        "bmp",
        "dib",
        "webp",
        "ico",
        "cur",
        "svg"
    ],
    AUDIO: ["mp3", "ogg", "oga", "spx", "ogg", "wav"],
    VIDEO: ["mp4", "ogg", "ogv", "webm"],
    SCRIPT: ["js", "mjs"],
    STYLE: ["css"]
};

const BASE_64_HEAD = ";base64,";

/**
 *
 * @param string
 */
const parseStringResource = string => {
    if (!new RegExp(`${BASE_64_HEAD}`).test(string)) {
        string = string
            .split(",")
            .pop() // gets the last
            .split(" ")
            .reduce((x, y) => (x.length > y.length ? x : y)); // gets the longest fragment in order to skip "x2", "" etc...
    }

    for (let format in SupportedFileExtensions) {
        const extensions = SupportedFileExtensions[format].join("|");

        if (
            new RegExp(
                `(.(${extensions})$)|data:${format}/(${extensions})${BASE_64_HEAD}`
            ).test(string)
        ) {
            const matches =
                string.match(new RegExp(`.(${extensions})$`, "g")) ||
                string.match(
                    new RegExp(`^data:${format}/(${extensions})`, "g")
                );

            if (null !== matches) {
                return {
                    type: format,
                    url: string /*,
                    extension: matches[0]
                        .replace(`data:${format}/`, "")
                        .replace(".", "")*/
                };
            }
        }
    }

    throw new Error("Error while parsing the resource string.");
};

/**
 *
 * @param element
 */
const parseElementResource = element => {
    if ("currentSrc" in element) {
        return element.currentSrc;
    }

    throw new Error("Error while parsing the resource element.");
};

/**
 *
 * @param resource
 */
export const parseResource = resource => {
    if (resource instanceof HTMLElement) {
        resource = parseElementResource(resource);
    }

    if (typeof resource === "string") {
        resource = parseStringResource(resource);
    }

    return resource;
};
