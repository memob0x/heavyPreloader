import { getURL } from "../src/loader.utils.mjs";
import lfetch from "../src/loader.fetch.mjs";
import lload from "../src/loader.load.mjs";

describe("html loader", () => {
    it("should return a promise which resolves to plain text", async () => {
        const path = "/base/test/resources/html.a-view.html";

        const blob = await lfetch(getURL(path).href);
        const text = await lload.load(blob);

        expect(text).to.be.a("string");

        return text;
    });

    it("should insert retrieved html to an element if provided in options", async () => {
        const path = "/base/test/resources/html.a-div-with-a-paragraph.html";
        const el = document.createElement("div");

        expect(el.innerHTML).to.equals("");

        const blob = await lfetch(getURL(path).href);
        const text = await lload.load(blob, { element: el });

        expect(el.innerHTML).to.equals(text);
        expect(el.children[0].tagName.toLowerCase()).to.equals("div");

        return text;
    });

    it("should filter retrieved html if filter is provided in options", async () => {
        const path = "/base/test/resources/html.a-div-with-a-paragraph.html";
        const el = document.createElement("div");

        expect(el.innerHTML).to.equals("");

        const blob = await lfetch(getURL(path).href);
        const text = await lload.load(blob, { element: el, filter: "p" });

        expect(el.innerHTML).not.to.equals("");
        expect(el.children[0].tagName.toLowerCase()).to.equals("p");

        // TODO: figure out, and possibly test, whether a not found "filter" result should empty the target "element" or not

        return text;
    });
});
