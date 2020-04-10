import { getURL } from "../src/loader.utils.mjs";
import lfetch from "../src/loader.fetch.mjs";
import lload from "../src/loader.load.mjs";

describe("stylesheet loader", () => {
    it("should return a promise which resolves to a CSSStyleSheet object", async () => {
        const path = "/base/test/resources/css.css";

        const blob = await lfetch(getURL(path).href);
        const stylesheet = await lload(blob);

        expect(stylesheet).to.be.an.instanceof(CSSStyleSheet);

        return stylesheet;
    });

    const getBodyBackgroundColor = () =>
        window.getComputedStyle(document.body).backgroundColor;

    it("should attach stylesheet to document if no different option is specified", async () => {
        const path = "/base/test/resources/css.blue-background.css";

        expect(getBodyBackgroundColor()).to.equals("rgba(0, 0, 0, 0)");

        const blob = await lfetch(getURL(path).href);
        const stylesheet = await lload(blob);

        expect(getBodyBackgroundColor()).to.equals("rgb(0, 0, 255)");

        return stylesheet;
    });
});
