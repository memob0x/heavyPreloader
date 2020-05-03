import { OUTPUT_FORMAT_KEYWORD } from "../builders/bundler.mjs";
import bundle from "../builders/bundler.mjs";

(async (options) =>
    await Promise.all([
        bundle("iife", options),
        bundle("amd", options),
        bundle("cjs", options),
        bundle("system", options),
        bundle("es", options)
    ]))({
    name: "Loader",
    input: "src/loader.mjs",
    output: `dist/loader.${OUTPUT_FORMAT_KEYWORD}.js`
});
