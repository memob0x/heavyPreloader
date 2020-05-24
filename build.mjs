import Handlebars from "handlebars";
import { ls, each, name, buffer } from "./build/utils.mjs";
import buildCSS from "./build/sass.mjs";
import buildHTML from "./build/hbs.mjs";

const partial = async (name, path) =>
    Handlebars.registerPartial(name, await buffer(path));

const eachHbs = async (path, callback) => await each(path, "hbs", callback);

(async (root) => {
    partial("layout", `${root}/layout.hbs`);

    await each(root, async (path) => {
        const entries = await ls(`${path}/src`);

        await each(
            entries,
            async (path) =>
                await eachHbs(path, async (file) => partial(name(file), file))
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
