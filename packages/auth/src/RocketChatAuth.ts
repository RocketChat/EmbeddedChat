import axios, { Axios, AxiosError } from "axios";
import loginWithPassword from "./loginWithPassword";
import loginWithOAuthService from "./loginWithOAuthService";
import loginWithOAuthServiceToken from "./loginWithOAuthServiceToken";
import loginWithResumeToken from "./loginWithResumeToken";

class RocketChatAuth {
	host: string;
	api: Axios;
	currentUser: any;
	lastFetched: Date;
	authListeners: ((user: object | null) => void )[] = [];
	constructor(host: string) {
		this.host = host;
		this.api = axios.create({
			baseURL: host,
			headers: {
				"Content-Type": "application/json"
			}
		});
		this.lastFetched = new Date(0);
		this.currentUser = null;
		this.load();
	}

	/**
	 * Add a callback that will be called when user login status changes
	 * @param callback
	 */
	async onAuthChange(callback: (user: object | null) => void) {
		this.authListeners.push(callback);
		const user = await this.getCurrentUser();
		callback(user);
	}

	notifyAuthListeners() {
		this.authListeners.forEach(cb => cb(this.currentUser));
	}

	/**
	 * Login with username and password
	 * @param credentials
	 * @returns 
	 */
	async loginWithPassword({user, password, code}: {
		user: string;
		password: string;
		code?: string | number;
	}) {
		const response = await loginWithPassword({
			api: this.api
		}, {
			user,
			password,
			code,
		})
		this.setUser(response.data)
		return this.currentUser;
	}

	/**
	 * TODO
	 * @param oauthService
	 */
	async loginWithOAuthService(oauthService: any) {
		const response = await loginWithOAuthService({
			api: this.api
		}, oauthService);
	}

	/**
	 * Login with OAuthService's accessToken. The service must be configured in RocketChat.
	 * @param credentials
	 * @returns 
	 */
	async loginWithOAuthServiceToken(credentials: { [key: string]: string; service: string; access_token: string; }) {
		const response = await loginWithOAuthServiceToken({
			api: this.api,
		},
		credentials)
		this.setUser(response.data)
		return this.currentUser;
	}

	/**
	 * Login with resume token
	 * @param resume Previous issued authToken
	 * @returns 
	 */
	async loginWithResumeToken(resume: string) {
		const response = await loginWithResumeToken({
			api: this.api
		}, {
			resume
		});
		this.setUser(response.data)
		return this.currentUser;
	}

	/**
	 * Get current user.
	 * @param refresh
	 * @returns 
	 */
	async getCurrentUser(refresh = false) {
		if (
			(this.currentUser && this.currentUser.authToken)
		) {
			if ( refresh ||	new Date() >= new Date(this.lastFetched.getTime() + 3540000)) { // 59 minutes 
				try {
					await this.loginWithResumeToken(this.currentUser.authToken);
				} catch (e) {
					if( e instanceof AxiosError && e.response?.status === 401) {
						// token cannot be refreshed as the resume token is no longer valid.
						await this.logout();
					} 
				}
			}
		}
		return this.currentUser;
	}

	/**
	 * Set current user
	 * @param user 
	 */
	async setUser(user: object) {
		this.lastFetched = new Date();
		this.currentUser = user;
		this.save()
	}

	/**
	 * Save current user to localStorage
	 */
	save() {
		localStorage.setItem("ec_user", JSON.stringify({
			user: this.currentUser,
			lastFetched: this.lastFetched
		}))
		this.notifyAuthListeners();
	}

	/**
	 * Load current user from localStorage
	 */
	async load() {
		const {user, lastFetched} = JSON.parse(localStorage.getItem("ec_user") || "{}");
		if (user) {
			this.lastFetched = new Date(lastFetched);
			this.setUser(user);
			await this.getCurrentUser(); // refresh the token if needed
		}
		this.notifyAuthListeners()
	}

	/**
	 * Logout current user
	 */
	async logout() {
		try {
      await this.api.post(`/api/v1/logout`, {
        headers: {
          'X-Auth-Token': this.currentUser.authToken,
          'X-User-Id': this.currentUser.userId,
        },
      });
    } catch (err) {
      console.error(err);
    }
		localStorage.removeItem("ec_user");
		this.lastFetched = new Date(0);
		this.currentUser = null;
		this.notifyAuthListeners();
	}
}

export default RocketChatAuth;
