import {
    readdir,
    asyncFilter,
    asyncForEach,
    isDirectory,
    isExtension,
} from "./utils.mjs";
import { buildCSS, buildHTML } from "./operations.mjs";

const buildComponent = async (path = "") => {
    const files = await readdir(`${path}/src`);

    const scsss = await asyncFilter(
        files,
        async (file) => await isExtension(file, "scss")
    );
    await asyncForEach(
        scsss,
        async (scss) => await buildCSS(scss, `${path}/dist`)
    );

    const hbss = await asyncFilter(
        files,
        async (file) => await isExtension(file, "hbs")
    );
    await asyncForEach(hbss, async (hbs) => await buildHTML(hbs, path));
};

(async (root) => {
    console.warn("demo: start");

    const paths = await readdir(root);

    const dirs = await asyncFilter(paths, isDirectory);

    await asyncForEach(dirs, buildComponent);

    console.warn("demo: end");
})("./demo");
