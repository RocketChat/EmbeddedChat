import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { URL } from "url";

export const getCallbackUrl = async (app: IApp) => {
    const serverURL = await app
        .getAccessors()
        .environmentReader.getServerSettings()
        .getValueById("Site_Url");
    const callbackEndPoint = app
        .getAccessors()
        .providedApiEndpoints.find((endpoint) => endpoint.path === "callback");
    if (callbackEndPoint) {
        const webhookURL = new URL(
            callbackEndPoint.computedPath || "",
            serverURL
        );
        return webhookURL.toString();
    }
    return "";
};
