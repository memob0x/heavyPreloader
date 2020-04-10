import { getURL } from "../src/loader.utils.mjs";
import fetch from "../src/loader.fetch.mjs";

describe("fetch function", () => {
    it("should return a promise which resolves to a resource blob object", () => {
        const path = "/base/test/resources/css.inherit.css";

        const success = fetch(getURL(path).href);
        success.then((x) => expect(x).to.be.an.instanceof(Blob));

        const error = fetch(path);
        error.catch((x) => expect(x).to.be.an.instanceof(Error));

        return Promise.allSettled([success, error]);
    });

    xit("should return a cached promise when a resource has already been fetched", (done) => {
        // TODO: figure out how to detect cache resource
        fetch("");

        done();
    });
});
