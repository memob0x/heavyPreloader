import { getURL } from "../src/loader.utils.mjs";

describe("utils", () => {
    it("should be able to make a URL object out of a relative path with getURL function", (done) => {
        const path = "/base/test/resources/css.css";
        const url = getURL(path);

        expect(url).to.be.an.instanceof(URL);
        expect(url.href).to.equals(location.origin + path);

        done();
    });
});
