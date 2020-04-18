import { promises as fs } from "fs";
import { basename } from "path";
import Handlebars from "handlebars";
import layouts from "handlebars-layouts";

Handlebars.registerHelper(layouts(Handlebars));

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
