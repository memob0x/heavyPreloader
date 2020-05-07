import { getURL } from "../../src/loader.utils.mjs";
import Fetch from "../../src/loader.fetch.mjs";
import Load from "../../src/loader.load.mjs";
import image from "../../src/loaders/loader.image.mjs";

describe("image loader", () => {
    const lfetch = new Fetch();
    const lload = new Load();
    lload.register("image", image);

    it("should return a promise which resolves to a load/error Event", async () => {
        const path = "/base/test/resources/image.1440x900.jpg";

        const blob = await lfetch.fetch(getURL(path).href);
        const event = await lload.load(blob);

        expect(event).to.be.an.instanceof(Event);

        return event;
    });

    it("should attach resource to a non existent image element if no other image element is provied in options", async () => {
        const path = "/base/test/resources/image.1440x900.jpg";
        const el = new Image();

        expect(el.naturalHeight).to.equals(0);

        const blob = await lfetch.fetch(getURL(path).href);
        const event = await lload.load(blob, { element: el });

        expect(el.naturalHeight).to.equals(900);

        return event;
    });
});
