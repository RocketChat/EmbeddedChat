import { IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { getAllowedOrigins } from "./getAllowedOrigins";

export const isAllowedOrigin = async (read: IRead, origin: string) => {
    const allowedOrigins = await getAllowedOrigins(read);
    if (allowedOrigins.length === 0) {
        // all origins are allowed
        return true;
    }
    return allowedOrigins.includes(origin);
};
