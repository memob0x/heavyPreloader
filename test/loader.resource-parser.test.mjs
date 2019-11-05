import { parseResource } from "../src/loader.resource-parser.mjs";

describe("Resource parser", () => {
    it("whatev", done => {
        const IMAGE_URL = "/base/test/resources/image.jpg";
        const img = document.createElement("img");

        img.src = IMAGE_URL;

        const resource = parseResource(img);

        expect(resource.url).to.contain(IMAGE_URL);

        done();
    });
});
