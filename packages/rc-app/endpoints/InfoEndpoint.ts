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
            serviceName,
            client_id,
            client_secret,
            redirect_uri,
            allowedOrigins,
        ] = await Promise.all([
            readEnvironment.getValueById("custom-oauth-name"),
            readEnvironment.getValueById("client-id"),
            readEnvironment.getValueById("client-secret"),
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
                configuredItems: {
                    client_id: !!client_id,
                    client_secret: !!client_secret,
                    custom_oauth_name: !!serviceName,
                }
            }
        }
    }
}
