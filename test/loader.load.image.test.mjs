import { loadImage } from "../src/loader.load.image.mjs";

const IMAGE_URL = "/base/test/resources/image.jpg";

describe("Image loader", () => {
    it("should successfully load an image", () =>
        loadImage(IMAGE_URL).then(url => expect(url).to.equal(IMAGE_URL)));

    it("should throw an error when attempting to load an unreachable image", () =>
        loadImage("//placehold.it/error").catch(error =>
            expect(error).to.be.an.instanceOf(Error)
        ));
});
