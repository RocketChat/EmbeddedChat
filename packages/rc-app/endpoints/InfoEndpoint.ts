import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ApiEndpoint,
    IApiEndpointInfo,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";
import { getCallbackUrl } from "../lib/getCallbackUrl";
import { getEnvironmentValues } from "../lib/getEnvironmentVariables";
import { getAllowedOrigins } from "../lib/getAllowedOrigins";

export class InfoEndpoint extends ApiEndpoint {
    public path = "info";
    public example = [];

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const readEnvironment = read.getEnvironmentReader().getSettings();

        const [
            width,
            height,
            channelName,
            anonymousMode,
            serviceName,
            client_id,
        ] = await getEnvironmentValues(readEnvironment, {
            width: "ec-width",
            height: "ec-height",
            channelName: "fallback-name",
            anonymousMode: "anonymous-mode",
            serviceName: "custom-oauth-name",
            client_id: "client-id",
        });

        const [redirect_uri, allowedOrigins] = await Promise.all([
            getCallbackUrl(this.app),
            getAllowedOrigins(read),
        ]);

        return {
            status: 200,
            content: {
                config: {
                    serviceName,
                    client_id,
                    allowedOrigins,
                    redirect_uri,
                },
                propConfig: {
                    width,
                    height,
                    channelName,
                    anonymousMode,
                },
            },
        };
    }
}
