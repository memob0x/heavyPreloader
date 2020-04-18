import { promises as fs } from "fs";
import { basename } from "path";
import sass from "node-sass";

export default async (file, dest) => {
    console.log(`${file}: start`);

    const result = await new Promise((resolve, reject) =>
        sass.render(
            {
                file: file,
                outputStyle: "compressed",
                sourceMap: dest,
            },
            (err, result) => (err ? reject(err) : resolve(result))
        )
    );

    const filename = basename(file).replace(/scss$/g, "css");
    await Promise.all([
        fs.writeFile(`${dest}/${filename}.map`, result.map),
        fs.writeFile(`${dest}/${filename}`, result.css),
    ]);

    console.log(`${file}: end`);
};
