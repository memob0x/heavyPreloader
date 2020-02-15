const _cast = (rawData, structure, interfaze) => {
    return rawData instanceof interfaze
        ? rawData
        : {
              ...structure,
              ...(rawData || {})
          };
};

export default class Data {
    constructor(rawData) {
        if (!rawData || typeof rawData !== "object") {
            rawData = {
                url: typeof rawData === "string" ? rawData : ""
            };
        }

        this.url = rawData.url || "";

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

    static isData(data) {
        return data instanceof this;
    }
}
