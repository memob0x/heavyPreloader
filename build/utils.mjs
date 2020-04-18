import { extname } from "path";
import { promises as fs } from "fs";
import { join } from "path";

export const readdir = async (root) => {
    const files = await fs.readdir(root);

    return files.map((file) => join(root, file));
};

export const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
};

export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const isDirectory = async (path) => {
    const stat = await fs.stat(path);

    return stat.isDirectory();
};

export const isExtension = async (path, extension) =>
    extname(path) === `.${extension}`;
