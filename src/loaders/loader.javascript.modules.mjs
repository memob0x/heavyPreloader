export default async (resource) => {
    //
    const url =
        resource instanceof Blob ? URL.createObjectURL(resource) : resource;

    //
    const result = await import(url);

    //
    URL.revokeObjectURL(url);

    //
    return result;
};
