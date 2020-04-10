import { getURL } from "../src/loader.utils.mjs";
import lfetch from "../src/loader.fetch.mjs";
import lload from "../src/loader.load.mjs";

describe("image loader", () => {
    it("should return a promise which resolves to a load/error Event", async () => {
        const path = "/base/test/resources/image.1440x900.jpg";

        const blob = await lfetch(getURL(path).href);
        const event = await lload.load(blob);

        expect(event).to.be.an.instanceof(Event);

        return event;
    });

    it("should attach resource to a non existent image element if no other image element is provied in options", async () => {
        const path = "/base/test/resources/image.1440x900.jpg";
        const el = new Image();

        expect(el.naturalHeight).to.equals(0);

        const blob = await lfetch(getURL(path).href);
        const event = await lload.load(blob, { element: el });

        expect(el.naturalHeight).to.equals(900);

        return event;
    });
});
