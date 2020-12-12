import { getURL } from "../../src/utils.mjs";
import Fetch from "../../src/fetch.mjs";
import Load from "../../src/load.mjs";
import javascript from "../../src/loaders/javascript-module.mjs";

describe("loaders/javascript-module", () => {
    const lfetch = new Fetch();
    const lload = new Load();
    lload.register("javascript", javascript);

    it("should return a promise which resolves to empty module if a non-module script is fetched", async () => {
        const path = "/base/test/resources/javascript.global.js";

        delete window.foo;
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
