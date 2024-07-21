import {
    ApiEndpoint,
    IApiRequest,
    IApiResponse,
    IApiEndpointInfo,
} from "@rocket.chat/apps-engine/definition/api";
import { getAllowedOrigins } from "../lib/getAllowedOrigins";
import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { extractTokenCookie } from "../lib/extractTokenCookie";

export class AuthTokenEndpoint extends ApiEndpoint {
    public path = "auth-token";

    private async generateHeaders(
        read: IRead,
        methods: string
    ): Promise<Record<string, string>> {
        const allowedOrigins = await getAllowedOrigins(read);
        return {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": allowedOrigins,
            "Access-Control-Allow-Methods": methods,
            "Access-Control-Allow-Headers": "Content-Type",
        };
    }

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const { token } = request.content;

        return {
            status: 200,
            content: {
                message: "Token set successfully.",
            },
            headers: {
                ...(await this.generateHeaders(read, "POST")),
                "Set-Cookie": `ec-token=${token}; Max-Age=${
                    24 * 60 * 60
                }; Path=/; HttpOnly; SameSite=None; Secure`,
            },
        };
    }

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const headers = await this.generateHeaders(read, "GET");
        const cookieHeader = request.headers.cookie;

        if (!cookieHeader) {
            return {
                status: 400,
                content: "no cookie header",
                headers,
            };
        }

        const token = extractTokenCookie(cookieHeader);

        if (!token) {
            return {
                status: 400,
                content: "ec-token not found",
                headers,
            };
        }

        return {
            status: 200,
            content: {
                token,
            },
            headers,
        };
    }

    public async delete(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        return {
            status: 200,
            content: {
                message: "Token unset successfully.",
            },
            headers: {
                ...(await this.generateHeaders(read, "DELETE")),
                "Set-Cookie":
                    "ec-token=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure",
            },
        };
    }

    public async options(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        return {
            status: 200,
            headers: await this.generateHeaders(
                read,
                "GET, POST, DELETE, OPTIONS"
            ),
        };
    }
}
