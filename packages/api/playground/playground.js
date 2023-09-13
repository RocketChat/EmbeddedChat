import EmbeddedChatApi from '../src/EmbeddedChatApi';
let messages = [];
async function saveToken(token) {
	localStorage.setItem("ec_token", token);
}

async function getToken() {
	return localStorage.getItem("ec_token");
}

async function deleteToken() {
	localStorage.removeItem("ec_token");
}

let api;

async function loginWithPassword() {
	const user = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	try {
		await api.auth.loginWithPassword({
			user,
			password
		})
	} catch(e) {
		printResult(e)
	}
}

async function printResult(result) {
	window.document.getElementById("output").innerHTML = "\n" + JSON.stringify(result, null, 2);
}

const msgListener = msg => {
	const idx = messages.findIndex(m => m._id === msg._id);
	if (idx === -1) {
		messages.push(msg)
	} else {
		messages[idx] = msg;
	}
	const feedEl = document.getElementById("msgs");
	feedEl.value = messages.map(m => `[${new Date(m.ts)}]: ${m?.msg}`).join('\n');
}

const onConfigChange = async (e) => {
	const host = document.getElementById('hostUrl').value;
	const roomId = document.getElementById('roomId').value;
	await api.close()
	api = new EmbeddedChatApi(host, roomId, { deleteToken, getToken, saveToken });
	api.auth.onAuthChange((user) => {
		showAuth(user)
		if (user) {
			api.connect()
				.then(() => {
					api.addMessageListener(msgListener);
				})
		} else {
			api.removeMessageListener(msgListener);
		}
	})
}

const showAuth = async (e) => {
	const user  = await api.auth.getCurrentUser();
	document.getElementById("userId").value = user?.userId;
	document.getElementById("username").value = user?.me?.name;
}

const callApi = async (e) => {
	const fn = document.getElementById("function").value
	const params = JSON.parse(document.getElementById("params").value)
	if(!api[fn]) {
		return alert(fn+' is not available in api');
	}
	const result  = await api[fn].apply(api, params);
	printResult(result);
}
window.addEventListener('DOMContentLoaded', () => {
	console.log('Ready')
	document.getElementById("loginWithPassword").addEventListener("click", loginWithPassword)
	
	const hostInput = document.getElementById("hostUrl")
	const roomInput = document.getElementById("roomId")
	const host = hostInput.value;
	const room = roomInput.value;
	api = new EmbeddedChatApi(host, room, { deleteToken, getToken, saveToken });
	hostInput.addEventListener("change", onConfigChange)
	hostInput.addEventListener("change", onConfigChange)
	onConfigChange();
	
	document.getElementById("logoutBtn").addEventListener("click", () => api.auth.logout())
	document.getElementById("call-api").addEventListener("click", callApi)
})

