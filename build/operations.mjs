import { rollup } from "rollup";
import { promises as fs } from "fs";
import { basename } from "path";
import sass from "node-sass";
import Handlebars from "handlebars";

export const createBoundle = async (options) => {
    options = { ...{ plugins: [], format: "umd" }, ...options };

    console.log(`${options.output}: start`);

    const init = await rollup({
        input: options.input,
        plugins: options.plugins,
    });

    await init.write({
        format: options.format,
        name: options.name,
        sourcemap: true,
        file: options.output,
    });

    console.log(`${options.output}: end`);
};

export const buildCSS = async (file, dest) => {
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

    await fs.writeFile(`${dest}/${filename}.map`, result.map);

    await fs.writeFile(`${dest}/${filename}`, result.css);

    console.log(`${file}: end`);
};

export const buildHTML = async (path, dest) => {
    console.log(`${path}: start`);

    const fileBuffer = await fs.readFile(path);
    const layoutBuffer = await fs.readFile("./demo/layout.hbs");

    const tpl = Handlebars.compile(
        fileBuffer.toString() + layoutBuffer.toString()
    );

    const filename = basename(path).replace(/hbs$/g, "html");
    await fs.writeFile(`${dest}/${filename}`, tpl());

    console.log(`${path}: end`);
};
