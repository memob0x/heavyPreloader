import { extname } from "path";
import { promises as fs } from "fs";
import { basename, join } from "path";

const getFiles = async (path, extension) =>
    await asyncFilter(
        Array.isArray(path) ? path : await getFilesAndDirectories(path),
        async (file) => await hasExtension(file, extension)
    );

const getDirectories = async (path) =>
    await asyncFilter(
        Array.isArray(path) ? path : await getFilesAndDirectories(path),
        isDirectory
    );

const asyncFilter = async (array, predicate) => {
    const results = await Promise.all(array.map(predicate));

    return array.filter((_v, index) => results[index]);
};

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

const isDirectory = async (path) => (await fs.stat(path)).isDirectory();

const hasExtension = async (path, extension) =>
    extname(path) === `.${extension}`;

export const loopFiles = async (path, ext, cb) =>
    await asyncForEach(await getFiles(path, ext), cb);

export const loopDirectories = async (path, cb) =>
    await asyncForEach(await getDirectories(path), cb);

export const getFilesAndDirectories = async (root) =>
    (await fs.readdir(root)).map((file) => join(root, file));

export const getFileName = (file) =>
    basename(file).split(".").slice(0, -1).join(".");

export const replaceExtension = (file, extension) =>
    `${getFileName(file)}.${extension}`;

export const readFile = (path) => fs.readFile(path, "utf-8");
