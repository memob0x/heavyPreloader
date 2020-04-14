import { promises as fs } from "fs";
import { join } from "path";

const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
};

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

const build = async (folder = "") => {
    console.log(`${folder} demo: start`);

    // TODO: /demo/xyz/src/*.scss --> /demo/xyz/dist/*.css
    // TODO: /demo/xyz/src/*.hbs --> /demo/xyz/index.html

    console.log(`${folder} demo: end`);
};

(async (path) => {
    console.warn("demo: start");

    const files = await fs.readdir(path);

    const dirs = await asyncFilter(files, async (file) => {
        const stat = await fs.stat(join(path, file));

        return stat.isDirectory();
    });

    await asyncForEach(dirs, build);

    console.warn("demo: end");
})("./demo");
