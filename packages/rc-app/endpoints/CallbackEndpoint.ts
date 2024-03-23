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
import { getTokenUrl } from "../lib/getTokenUrl";
import { getCallbackContent } from "../lib/getCallbackContent";
import { URLSearchParams } from "url";
import { getCallbackUrl } from "../lib/getCallbackUrl";

export class CallbackEndpoint extends ApiEndpoint {
    public path = "callback";
    public example = [];

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const { state, code } = request.query;
        const readEnvironment = read.getEnvironmentReader().getSettings();
        const [
            customOAuthName,
            client_id,
            client_secret,
            redirect_uri,
            origin,
            tokenUrl,
        ] = await Promise.all([
            readEnvironment.getValueById("custom-oauth-name"),
            readEnvironment.getValueById("client-id"),
            readEnvironment.getValueById("client-secret"),
            getCallbackUrl(this.app),
            Promise.resolve(decodeURIComponent(state)),
            getTokenUrl(read),
        ]);

        const formData = new URLSearchParams();
        formData.append("grant_type", "authorization_code");
        formData.append("client_id", client_id);
        formData.append("client_secret", client_secret);
        formData.append("redirect_uri", redirect_uri);
        formData.append("code", code);

        const response = await http.post(tokenUrl, {
            content: formData.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (response.statusCode !== 200) {
            return {
                status: response.statusCode,
                content: await getCallbackContent(
                    read,
                    null,
                    origin,
                    response.data.error_description || "Unknown"
                ),
                headers: {
                    "Content-Security-Policy":
                        "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-src 'self'; font-src 'self'; object-src 'none'",
                },
            };
        }

        return {
            status: 200,
            content: await getCallbackContent(
                read,
                {
                    accessToken: response.data?.access_token,
                    expiresIn: response.data?.expires_in,
                    serviceName: customOAuthName,
                },
                origin,
                false
            ),
            headers: {
                "Content-Security-Policy":
                    "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-src 'self'; font-src 'self'; object-src 'none'",
            },
        };
    }
}
