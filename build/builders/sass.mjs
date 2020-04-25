import { promises as fs } from "fs";
import sass from "node-sass";
import { replaceExtension } from "../utils.mjs";

export default async (file, dest) => {
    console.log(`${file}: start`);

    const result = await new Promise((resolve, reject) =>
        sass.render(
            {
                file: file,
                outputStyle: "compressed",
                sourceMap: dest
            },
            (err, result) => (err ? reject(err) : resolve(result))
        )
    );

    const getFileName = replaceExtension(file, "css");
    await Promise.all([
        fs.writeFile(`${dest}/${getFileName}.map`, result.map),
        fs.writeFile(`${dest}/${getFileName}`, result.css)
    ]);

    console.log(`${file}: end`);
};
