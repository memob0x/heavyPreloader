import { OUTPUT_FORMAT_KEYWORD } from "../builders/bundler.mjs";
import bundle from "../builders/bundler.mjs";
import { each, name } from "../utils.mjs";

const boundles = (options) =>
    Promise.all([
        bundle("iife", options),
        bundle("amd", options),
        bundle("cjs", options),
        bundle("system", options),
        bundle("es", options)
    ]);

(async (options) => await boundles(options))({
    name: "Loader",
    input: "src/loader.mjs",
    output: `dist/loader.${OUTPUT_FORMAT_KEYWORD}.js`
});

(async (path) =>
    await each(path, "mjs", async (file) => {
        const filename = name(file);

        await boundles({
            name: `${filename.split(".")[1]}Loader`,
            input: file,
            output: `dist/loaders/${filename}.${OUTPUT_FORMAT_KEYWORD}.js`
        });
    }))("src/loaders");
