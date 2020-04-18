import { rollup } from "rollup";

export default async (options) => {
    options = { ...{ plugins: [], format: "umd" }, ...options };

    console.log(`${options.output}: start`);

    await (
        await rollup({
            input: options.input,
            plugins: options.plugins,
        })
    ).write({
        format: options.format,
        name: options.name,
        sourcemap: true,
        file: options.output,
    });

    console.log(`${options.output}: end`);
};
