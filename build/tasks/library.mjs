import { OUTPUT_FORMAT_KEYWORD } from "../builders/bundler.mjs";
import bundle from "../builders/bundler.mjs";

(async (options) =>
    await Promise.all([
        bundle("cjs", options),
        bundle("amd", options),
        bundle("iife", options),
        bundle("es", options)
    ]))({
    name: "Loader",
    input: "src/loader.mjs",
    output: `dist/loader.${OUTPUT_FORMAT_KEYWORD}.js`
});
