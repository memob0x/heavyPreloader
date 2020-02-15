import { getURL } from "./loader.utils.mjs";

const _cast = (rawData, structure, interfaze) => {
    return rawData instanceof interfaze
        ? rawData
        : {
              ...structure,
              ...(rawData || {})
          };
};

export default class LoaderResource {
    constructor(rawData) {
        if (!rawData || typeof rawData !== "object") {
            rawData = {
                url: typeof rawData === "string" ? rawData : ""
            };
        }

        this.url = getURL(rawData.url || "").href;

        this.blob = _cast(
            rawData.blob,
            {
                size: 0,
                type: ""
            },
            Blob
        );

        this.response = _cast(
            rawData.response,
            {
                url: this.url,
                status: 200,
                statusText: ""
            },
            Response
        );
    }

    static isLoaderResource(data) {
        return data instanceof this;
    }
}
