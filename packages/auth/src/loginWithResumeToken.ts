import { Axios } from "axios";
import getAuthorizationUrl from "./getAuthorizationUrl";

const loginWithResumeToken = async (
	config: {
		api: Axios
	}, 
	credentials: {
		resume: string
	}
) => {
	const response = await config.api.post('/api/v1/login', credentials)
	return response.data;
}

export default loginWithResumeToken;
