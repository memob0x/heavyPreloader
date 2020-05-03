import { getURL } from "../../src/loader.utils.mjs";
import lfetch from "../../src/loader.fetch.mjs";
import lload from "../../src/loader.load.mjs";
import javascript from "../../src/loaders/loader.javascript.mjs";

describe("scripts loader", () => {
    lload.register("javascript", javascript);

    it("should return a promise which resolves to empty module if a non-module script is fetched", async () => {
        const path = "/base/test/resources/javascript.global.js";

        expect(window).not.to.have.property("foo");

        const blob = await lfetch.fetch(getURL(path).href);
        const empty = await lload.load(blob);

        expect(empty).to.be.a("module").that.is.empty;
        expect(window).to.have.property("foo", "bar");

        return empty;
    });

    it("should return a promise which resolves to an exported api from the fetched module", async () => {
        const path = "/base/test/resources/javascript.module.mjs";

        const blob = await lfetch.fetch(getURL(path).href);
        const module = await lload.load(blob);

        expect(module).to.be.a("module").that.is.not.empty;
        expect(module).to.have.property("default");
        expect(module).to.deep.include({ default: { foo: "bar" } });

        return module;
    });
});
