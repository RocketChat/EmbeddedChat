import {
    ApiEndpoint,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";

export class SaveTokenEndpoint extends ApiEndpoint {
    public path = "save-token";

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
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Set-Cookie": [
                    `token=${token}; Max-Age=${
                        24 * 60 * 60 * 1000
                    }; Path=/; HttpOnly; SameSite=None; Secure`,
                ],
            },
        };
    }

    public async options(): Promise<IApiResponse> {
        return {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
}
