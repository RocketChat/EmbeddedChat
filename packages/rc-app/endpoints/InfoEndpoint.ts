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
        try {
            const readEnvironment = read.getEnvironmentReader().getSettings();

            const [
                serviceName,
                client_id,
                width,
                height,
                channelName,
                anonymousMode,
                roomId,
                toastBarPosition,
                showRoles,
                showAvatar,
                showUsername,
                showName,
                enableThreads,
                className,
                hideHeader,
                secure,
                dark,
                theme,
            ] = await getEnvironmentValues(readEnvironment, {
                serviceName: "custom-oauth-name",
                client_id: "client-id",
                width: "ec-width",
                height: "ec-height",
                channelName: "fallback-name",
                anonymousMode: "anonymous-mode",
                roomId: "room-id",
                toastBarPosition: "toast-bar-position",
                showRoles: "show-roles",
                showAvatar: "show-avatar",
                showUsername: "show-username",
                showName: "show-name",
                enableThreads: "enable-threads",
                className: "ec-class-name",
                hideHeader: "hide-header",
                secure: "secure",
                dark: "dark",
                theme: "theme",
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
                        roomId,
                        toastBarPosition,
                        showRoles,
                        showAvatar,
                        showUsername,
                        showName,
                        enableThreads,
                        className,
                        hideHeader,
                        secure,
                        dark,
                        theme,
                    },
                },
            };
        } catch (error) {
            console.error("Error occurred in InfoEndpoint:", error);
            return {
                status: 500,
                content: {
                    error: "Internal Server Error",
                },
            };
        }
    }
}
