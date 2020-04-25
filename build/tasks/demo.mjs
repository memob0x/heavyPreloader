import Handlebars from "handlebars";
import {
    getFilesAndDirectories,
    loopFiles,
    loopDirectories,
    getFileName,
    readFile
} from "../utils.mjs";
import buildCSS from "../builders/sass.mjs";
import buildHTML from "../builders/hbs.mjs";

(async (root) => {
    Handlebars.registerPartial("layout", await readFile(`${root}/layout.hbs`));

    await loopDirectories(root, async (path) => {
        const files = await getFilesAndDirectories(`${path}/src`);

        await loopDirectories(
            files,
            async (path) =>
                await loopFiles(path, "hbs", async (file) =>
                    Handlebars.registerPartial(
                        getFileName(file),
                        await readFile(file)
                    )
                )
        );

        await Promise.all([
            loopFiles(
                files,
                "scss",
                async (scss) => await buildCSS(scss, `${path}/dist`)
            ),

            loopFiles(files, "hbs", async (hbs) => await buildHTML(hbs, path))
        ]);
    });
})("./demo");
