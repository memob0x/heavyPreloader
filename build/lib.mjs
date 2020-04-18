import terser from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import "@babel/core";
import { createBoundle } from "./operations.mjs";

const minify = () =>
    terser.terser({
        sourcemap: true,
    });

(async (options, basename) => {
    console.log("library boundle: start");

    await createBoundle({
        ...options,
        output: `${basename}.js`,
    });

    await createBoundle({
        ...options,
        output: `${basename}.min.js`,
        plugins: [minify()],
    });

    await createBoundle({
        ...options,
        output: `${basename}.es5.js`,
        plugins: [babel()],
    });

    await createBoundle({
        ...options,
        output: `${basename}.es5.min.js`,
        plugins: [babel(), minify()],
    });

    console.log("library boundle: end");
})(
    {
        name: "Loader",
        input: "src/loader.mjs",
    },
    "dist/loader"
);
