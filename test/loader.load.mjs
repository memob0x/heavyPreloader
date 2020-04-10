import lload from "../src/loader.load.mjs";

describe("load function", () => {
    it("should be able to recognize media type blob objects", async () => {
        const type = "image/gif";
        const promise = new Promise((resolve) => lload.register(type, resolve));

        await lload.load(new Blob([], { type: type }));

        return promise;
    });

    // TODO: test specificity prioritiazion "x/y" > "x" > "y"
});
