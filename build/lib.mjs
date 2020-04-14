import { rollup } from "rollup";
import terser from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import "@babel/core";

const minify = () =>
    terser.terser({
        sourcemap: true,
    });

const boundler = async (file = "", plugins = []) => {
    console.log(`${file} boundle: start`);

    const init = await rollup({
        input: "src/loader.mjs",
        plugins: plugins,
    });

    await init.write({
        format: "umd",
        name: "Loader",
        sourcemap: true,
        file: file,
    });

    console.log(`${file} boundle: end`);
};

(async () => {
    console.log("library boundle: start");

    await boundler("dist/loader.js");

    await boundler("dist/loader.min.js", [minify()]);

    await boundler("dist/loader.es5.js", [babel()]);

    await boundler("dist/loader.es5.min.js", [babel(), minify()]);

    console.log("library boundle: end");
})();
