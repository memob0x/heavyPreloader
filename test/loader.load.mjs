import Loader from "../src/loader.mjs";

describe("load function", () => {
    const instance = new Loader();

    it("should be able to recognize image media type blob objects", async () => {
        const type = "image/gif";
        const promise = new Promise((resolve) =>
            instance.register(type, resolve)
        );

        await instance.load(new Blob([], { type: type }));

        return promise;
    });

    it("should be able to recognize css media type blob objects", async () => {
        const type = "text/css";
        const promise = new Promise((resolve) =>
            instance.register(type, resolve)
        );

        await instance.load(new Blob([], { type: type }));

        return promise;
    });

    it("should be able to recognize javascript media type blob objects", async () => {
        const type = "application/javascript";
        const promise = new Promise((resolve) =>
            instance.register(type, resolve)
        );

        await instance.load(new Blob([], { type: type }));

        return promise;
    });

    it("should be able to recognize html media type blob objects", async () => {
        const type = "text/html";
        const promise = new Promise((resolve) =>
            instance.register(type, resolve)
        );

        await instance.load(new Blob([], { type: type }));

        return promise;
    });
});
