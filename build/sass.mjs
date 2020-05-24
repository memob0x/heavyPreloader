import { promises as fs } from "fs";
import sass from "node-sass";
import { name } from "./utils.mjs";

export default async (path, dest) => {
    console.log(`${path}: start`);

    const result = await new Promise((resolve, reject) =>
        sass.render(
            {
                file: path,
                outputStyle: "compressed",
                sourceMap: dest
            },
            (err, result) => (err ? reject(err) : resolve(result))
        )
    );

    const file = name(path, "css");
    await Promise.all([
        fs.writeFile(`${dest}/${file}.map`, result.map),
        fs.writeFile(`${dest}/${file}`, result.css)
    ]);

    console.log(`${path}: end`);
};
