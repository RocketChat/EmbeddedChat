import { Axios } from "axios";
import getAuthorizationUrl from "./getAuthorizationUrl";

const loginWithOAuthServiceToken = async (
	config: {
		api: Axios
	}, 
	credentials: {
		service: string;
		access_token: string;
		[key:string]: string;
	}
) => {
	const response = await config.api.post('/api/v1/login', credentials)
	return response.data;
}

export default loginWithOAuthServiceToken;
