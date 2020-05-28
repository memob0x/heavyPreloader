import { ls, each, name } from "./build/utils.mjs";
import buildCSS from "./build/sass.mjs";
import buildHTML from "./build/hbs.mjs";
import buildJS from "./build/mjs.mjs";
import { registerHbsPartial, eachHbs } from "./build/hbs.mjs";

// demo files
// -----------------------------------------------------------------------------------------
(async (root) => {
    registerHbsPartial("layout", `${root}/layout.hbs`);

    await each(root, async (path) => {
        const entries = await ls(`${path}/src`);

        await each(
            entries,
            async (path) =>
                await eachHbs(path, async (file) =>
                    registerHbsPartial(name(file), file)
                )
        );

        await Promise.all([
            each(
                entries,
                "scss",
                async (scss) => await buildCSS(scss, `${path}/dist`)
            ),

            eachHbs(entries, async (hbs) => await buildHTML(hbs, path))
        ]);
    });
})("./demo");

// library (standard esm)
// -----------------------------------------------------------------------------------------
(async () =>
    await Promise.all([
        each(
            await ls("./src/"),
            "mjs",
            async (scss) => await buildJS(scss, "./dist/esm")
        ),

        each(
            await ls("./src/loaders"),
            "mjs",
            async (scss) => await buildJS(scss, "./dist/esm/loaders")
        )
    ]))();
