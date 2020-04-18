import terser from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import "@babel/core";

import createBundle from "../builders/bundler.mjs";

const minify = () =>
    terser.terser({
        sourcemap: true,
    });

(async (options, basename) =>
    await Promise.all([
        createBundle({
            ...options,
            output: `${basename}.js`,
        }),

        createBundle({
            ...options,
            output: `${basename}.min.js`,
            plugins: [minify()],
        }),

        createBundle({
            ...options,
            output: `${basename}.es5.js`,
            plugins: [babel()],
        }),

        createBundle({
            ...options,
            output: `${basename}.es5.min.js`,
            plugins: [babel(), minify()],
        }),
    ]))(
    {
        name: "Loader",
        input: "src/loader.mjs",
    },
    "dist/loader"
);
