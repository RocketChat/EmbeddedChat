export const getEnvironmentValues = async (
    readEnvironment: any,
    keys: { [key: string]: string }
): Promise<any[]> => {
    const promises = Object.keys(keys).map((key) =>
        readEnvironment.getValueById(keys[key])
    );
    return await Promise.all(promises);
};
