import { rocketChatAuth } from '../src'

async function saveToken (token) {
	localStorage.setItem("ec_token", token);
}

async function getToken() {
	return localStorage.getItem("ec_token");
}

async function deleteToken() {
	localStorage.removeItem("ec_token");
}

let auth = rocketChatAuth({
	host: "http://localhost:3000",
	getToken,
	saveToken,
	deleteToken,
});

async function loginWithPassword() {
	const user = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	try {
		await auth.loginWithPassword({
			user,
			password
		})
	} catch(e) {
		printResult(e)
	}
}

async function loginWithOAuth() {
	const config = JSON.parse(document.getElementById("oauthconfig").value);
	try {
		await auth.loginWithOAuthService(config)
	} catch (e) {
		printResult(e)
	}
}

async function printResult(result) {
	window.document.getElementById("output").innerHTML = "\n" + JSON.stringify(result, null, 2);
}

window.document.body.onload = () => {
	document.getElementById("loginWithPassword").addEventListener("click", loginWithPassword)
	document.getElementById("loginWithOAuth").addEventListener("click", loginWithOAuth)
	
	const hostInput = document.getElementById("hostUrl")
	const host = hostInput.value;
	auth = rocketChatAuth({
		host,
		saveToken,
		getToken,
		deleteToken,
	});
	hostInput.addEventListener("change", (e) => {
		auth = rocketChatAuth({
			host: e.target.value
		});
	})
	auth.onAuthChange(printResult);
	document.getElementById("logoutBtn").addEventListener("click", () => auth.logout())
}

