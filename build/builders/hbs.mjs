import { promises as fs, existsSync } from "fs";
import { basename } from "path";
import Handlebars from "handlebars";
import layouts from "handlebars-layouts";
import { name, buffer, extension } from "../utils.mjs";
import minify from "@node-minify/core";
import htmlMinifier from "@node-minify/html-minifier";

Handlebars.registerHelper(layouts(Handlebars));

const getModel = async (path) =>
    JSON.parse(existsSync(path) ? await buffer(path) : "{}");

const buildView = async (view, data) =>
    await minify({
        compressor: htmlMinifier,
        content: Handlebars.compile(view)({}, { data: data })
    });

export default async (path, dest) => {
    console.log(`${path}: start`);

    var model = await getModel(extension(path, "json"));

    await fs.writeFile(
        `${dest}/${name(path, "html")}`,
        await buildView(await buffer(path), {
            ...model,
            path: dest,
            folder: basename(dest)
        })
    );

    console.log(`${path}: end`);
};
