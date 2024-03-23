import { IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { URL } from "url";

export const getTokenUrl = async (read: IRead) => {
    const serverURL = await read
        .getEnvironmentReader()
        .getServerSettings()
        .getValueById("Site_Url");
    const url = new URL("/oauth/token", serverURL);
    return url.toString();
};
