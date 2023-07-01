import { Axios } from "axios";
import getAuthorizationUrl from "./getAuthorizationUrl";

const loginWithOAuthService = async (
	config: {
		api: Axios
	}, 
	oauthService: any
) => {
	const authorizeUrl = getAuthorizationUrl(oauthService) + `?client_id=${oauthService.clientId}&state=${1234}`;
	alert(authorizeUrl)
	let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000,rel=opener`;
	const popup = window.open(authorizeUrl, "Login", params);
	let tempPackage: any = null;
	if ((window as any).Package?.oauth?.OAuth?._handleCredentialSecret) {
		tempPackage = (window as any).Package;
	}
	(window as any).Package = {
		oauth: {
			OAuth: {
				_handleCredentialSecret: (credentialToken: string, credentialSecret: string) => {
					console.log(credentialSecret, credentialToken);
					if (tempPackage) {
						(window as any).Package = tempPackage;
					}
				}
			}
		}
	}
	if (popup) {
		popup.window.onclose = async (e) => {
			console.log('Popup close');
			e.preventDefault();
			(globalThis as any).popup = popup;
			const keys = Object.keys(popup.window.localStorage);
			let credentialSecret, credentialToken
			keys.forEach(key => {
				if(key.startsWith('Meteor.oauth.credentialSecret')) {
					const [,token] = key.split('-');
					credentialToken = token;
					credentialSecret = window.localStorage.getItem(key); 
				}
			});
			if (!(credentialSecret && credentialToken)) {
				return null
			}
			const response = await config.api.post('/api/v1/login', {
				oauth: {
					credentialToken,
					credentialSecret,
				}
			})
			return response.data;
		}
	}
}

export default loginWithOAuthService;
