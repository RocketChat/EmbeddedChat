import {
    ApiEndpoint,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";

export class AuthTokenEndpoint extends ApiEndpoint {
    public path = "auth-token";

    public async post(request: IApiRequest): Promise<IApiResponse> {
        const { token } = request.content;

        return {
            status: 200,
            content: {
                message: "Token set successfully.",
            },
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "http://localhost:6006",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type",
                "Set-Cookie": [
                    `ec-token=${token}; Max-Age=${
                        24 * 60 * 60 * 1000
                    }; Path=/; HttpOnly; SameSite=None; Secure`,
                ],
            },
        };
    }

    public async get(request: IApiRequest): Promise<IApiResponse> {
        const cookieHeader = request.headers.cookie;
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
            if (key.trim() === "ec-token") {
                token = decodeURIComponent(value);
                break;
            }
        }

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
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    public async delete(): Promise<IApiResponse> {
        return {
            status: 200,
            content: {
                message: "Token unset successfully.",
            },
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "http://localhost:6006",
                "Access-Control-Allow-Methods": "DELETE",
                "Access-Control-Allow-Headers": "Content-Type",
                "Set-Cookie":
                    "ec-token=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure",
            },
        };
    }

    public async options(): Promise<IApiResponse> {
        return {
            status: 200,
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "http://localhost:6006",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
}
