import modern from "./loader.css.modern.mjs";
import legacy from "./loader.css.legacy.mjs";

export default async (blob, options) => {
    try {
        return await modern(blob, options);
    } catch {
        return await legacy(URL.createObjectURL(blob));
    }
};
