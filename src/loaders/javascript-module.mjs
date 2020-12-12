/**
 * 
 */
export default async blob => {
    //
    const url = URL.createObjectURL(blob);

    //
    const result = await import(url);

    //
    URL.revokeObjectURL(url);

    //
    return result;
};
