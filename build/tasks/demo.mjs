import { promises as fs } from "fs";
import Handlebars from "handlebars";

import {
    readdir,
    asyncFilter,
    asyncForEach,
    isDirectory,
    isExtension,
} from "../utils.mjs";
import buildCSS from "../builders/sass.mjs";
import buildHTML from "../builders/hbs.mjs";

const buildComponentStyle = async (files, path) =>
    await asyncForEach(
        await asyncFilter(
            files,
            async (file) => await isExtension(file, "scss")
        ),
        async (scss) => await buildCSS(scss, `${path}/dist`)
    );

const buildComponentHtml = async (files, path) =>
    await asyncForEach(
        await asyncFilter(
            files,
            async (file) => await isExtension(file, "hbs")
        ),
        async (hbs) => await buildHTML(hbs, path)
    );

(async (root) => {
    Handlebars.registerPartial(
        "layout",
        await fs.readFile(`${root}/layout.hbs`, "utf-8")
    );

    const paths = await readdir(root);
    const dirs = await asyncFilter(paths, isDirectory);
    await asyncForEach(dirs, async (path = "") => {
        const files = await readdir(`${path}/src`);

        await Promise.all([
            buildComponentStyle(files, path),
            buildComponentHtml(files, path),
        ]);
    });
})("./demo");
