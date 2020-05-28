import { promises as fs } from "fs";
import { buffer, name } from "./utils.mjs";
import babel from "@babel/core";

export default async (path, dest) => {
    console.log(`${path}: start`);

    const result = await babel.transformAsync(await buffer(path), {
        compact: true,
        comments: false,
        sourceMaps: true
    });

    const file = name(path, "mjs");
    await Promise.all([
        fs.writeFile(`${dest}/${file}.map`, JSON.stringify(result.map)),
        fs.writeFile(`${dest}/${file}`, result.code)
    ]);

    console.log(`${path}: end`);
};
