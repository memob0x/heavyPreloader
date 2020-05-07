import { getURL } from "../src/loader.utils.mjs";
import Fetch from "../src/loader.fetch.mjs";

describe("fetch function", () => {
    const path = "/base/test/resources/css.inherit.css";
    const url = getURL(path).href;
    const lfetch = new Fetch();

    it("should return a promise which resolves to a resource blob object", () => {
        const success = lfetch.fetch(url);
        success.then((x) => expect(x).to.be.an.instanceof(Blob));

        const error = lfetch.fetch(path);
        error.catch((x) => expect(x).to.be.an.instanceof(Error));

        return Promise.allSettled([success, error]);
    });

    it("should return a cached promise when a resource has already been fetched", async () => {
        expect(lfetch.cache).to.have.property(url);

        const value = "ok";

        const promise = Promise.resolve(value);

        lfetch.cache[url] = promise;

        const result = await lfetch.fetch(url);

        expect(result).to.equals(value);

        lfetch.cache = {};

        return promise;
    });
});
