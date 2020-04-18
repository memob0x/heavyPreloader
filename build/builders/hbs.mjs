import { promises as fs } from "fs";
import { basename } from "path";
import Handlebars from "handlebars";
import layouts from "handlebars-layouts";

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
        `${dest}/${basename(path).replace(/hbs$/g, "html")}`,
        Handlebars.compile(await fs.readFile(path, "utf-8"))(
            {},
            {
                data: {
                    path: dest,
                    folder: basename(dest),
                },
            }
        )
    );

    console.log(`${path}: end`);
};
