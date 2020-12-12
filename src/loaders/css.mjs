import modern from "./css-modern.mjs";
import legacy from "./css-legacy.mjs";

/**
 * 
 */
export default async (blob, options) => {
    //
    try {
        return await modern(blob, options);
    } catch {
        return await legacy(blob);
    }
};
