import {
    ApiEndpoint,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";

export class DeleteTokenEndpoint extends ApiEndpoint {
    public path = "delete-token";

    public async delete(): Promise<IApiResponse> {
        return {
            status: 200,
            content: {
                message: "Token unset successfully.",
            },
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "http://localhost:6006",
                "Access-Control-Allow-Methods": "DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Set-Cookie":
                    "token=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure",
            },
        };
    }

    public async options(): Promise<IApiResponse> {
        return {
            status: 200,
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "http://localhost:6006",
                "Access-Control-Allow-Methods": "DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
}
