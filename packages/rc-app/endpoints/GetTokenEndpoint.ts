import {
    ApiEndpoint,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";

export class GetTokenEndpoint extends ApiEndpoint {
    public path = "get-token";

    public async get(request: IApiRequest): Promise<IApiResponse> {
        const cookieHeader = request.headers.cookie;
        this.app.getLogger().debug(cookieHeader);
        if (!cookieHeader) {
            return {
                status: 400,
                content: "Missing token cookie",
            };
        }

        const cookiesArray = cookieHeader
            .split(";")
            .map((cookie) => cookie.trim());

        let token: string | undefined;
        for (const cookie of cookiesArray) {
            const [key, value] = cookie.split("=");
            if (key.trim() === "token") {
                token = decodeURIComponent(value);
                break;
            }
        }

        this.app.getLogger().debug(token);

        if (!token) {
            return {
                status: 400,
                content: "Token cookie not found",
            };
        }

        return {
            status: 200,
            content: {
                token: token,
            },
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "http://localhost:6006",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    public async options(): Promise<IApiResponse> {
        return {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
}
