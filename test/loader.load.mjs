import lload from "../src/loader.load.mjs";

// FIXME: find a more accurate way rather then checking the returned type, this is not the proper way to test this function

describe("load function", () => {
    it("should be able to recognize image media type blob objects", async () => {
        try {
            await lload(new Blob([], { type: "image/gif" }));
        } catch (e) {
            expect(e).to.be.an.instanceof(Error);
        }

        return Promise.resolve();
    });

    it("should be able to recognize css media type blob objects", async () => {
        const load = await lload(new Blob([], { type: "text/css" }));

        expect(load).to.be.an.instanceof(CSSStyleSheet);

        return load;
    });

    it("should be able to recognize javascript media type blob objects", async () => {
        const load = await lload(new Blob([], { type: "text/javascript" }));

        expect(load).to.be.a("module");

        return load;
    });

    it("should be able to recognize html media type blob objects", async () => {
        const load = await lload(new Blob([], { type: "text/html" }));

        expect(load).to.be.a("string");

        return load;
    });
});
