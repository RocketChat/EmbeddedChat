export const getAllowedOrigins = async (read) => {
    const allowedOrigins = await read
        .getEnvironmentReader()
        .getSettings()
        .getValueById("allowed-origins");
    if (!allowedOrigins) {
        return [];
    }
    const origins = allowedOrigins
        .split(",")
        .filter((domain) => !!domain.trim());
    return origins;
};
