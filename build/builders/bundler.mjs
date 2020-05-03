import "@babel/core";
import { rollup } from "rollup";
import terser from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

const write = { sourcemap: true };

const minify = () => terser.terser(write);

const variants = [
    {
        formats: [],
        plugins: []
    },
    {
        formats: ["min"],
        plugins: [minify()]
    },
    {
        formats: ["es5"],
        plugins: [babel()]
    },
    {
        formats: ["es5", "min"],
        plugins: [babel(), minify()]
    }
];

export const OUTPUT_FORMAT_KEYWORD = "%formats%";

export default async (format, options) => {
    let jobs = [];

    variants.forEach(async (variant) => {
        const output = options.output.replace(
            OUTPUT_FORMAT_KEYWORD,
            [format, ...variant.formats].join(".")
        );

        console.log(`${output}: start`);

        const init = await rollup({
            input: options.input,
            plugins: variant.plugins
        });

        const job = init.write({
            ...write,
            format: format,
            name: options.name,
            file: output
        });

        jobs.push(job);

        await job;

        console.log(`${output}: end`);
    });

    await Promise.all(jobs);
};
