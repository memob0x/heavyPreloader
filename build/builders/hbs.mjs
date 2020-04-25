import { promises as fs } from "fs";
import { basename } from "path";
import Handlebars from "handlebars";
import layouts from "handlebars-layouts";
import { replaceExtension, readFile } from "../utils.mjs";

Handlebars.registerHelper(layouts(Handlebars));

Handlebars.registerHelper("repeat", (n, block) => {
    let accum = "";

    for (var i = 0; i < n; ++i) {
        accum += block.fn(i);
    }

    return accum;
});

export default async (path, dest) => {
    console.log(`${path}: start`);

    await fs.writeFile(
        `${dest}/${replaceExtension(path, "html")}`,
        Handlebars.compile(await readFile(path))(
            {},
            {
                data: {
                    path: dest,
                    folder: basename(dest)
                }
            }
        )
    );

    console.log(`${path}: end`);
};
