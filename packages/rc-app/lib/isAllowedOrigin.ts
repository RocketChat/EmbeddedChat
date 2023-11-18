import { IRead } from "@rocket.chat/apps-engine/definition/accessors";

export const isAllowedOrigin = async (read: IRead, origin: string) => {
    const allowedDomains = await read.getEnvironmentReader().getSettings().getValueById("allowed-domains");
    if (!allowedDomains) {
        return true;
    }
    const domains = allowedDomains.split(',').filter((domain) => !!domain.trim());
    if (domains.length === 0) {
        // all origins are allowed
        return true;
    }
    return domains.includes(origin);
}
