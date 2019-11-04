import { loadImage } from "../src/loader.load.image.mjs";

describe("Image loader", () => {
    const IMAGE_URL = "/base/test/resources/image.jpg";

    it("should successfully load an image", () =>
        loadImage(IMAGE_URL).then(url => expect(url).to.equal(IMAGE_URL)));

    it("should throw an error when attempting to load an unreachable image", () =>
        loadImage("https://github.com/404").catch(error =>
            expect(error).to.be.an.instanceOf(Error)
        ));

    it("should throw an error when attempting to load a wrong file type", () =>
        loadImage("/base/test/resources/script.js").catch(error =>
            expect(error).to.be.an.instanceOf(Error)
        ));
});
