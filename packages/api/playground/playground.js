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

async function loginWithRocketChatOAuth() {
  try {
    await api.auth.loginWithRocketChatOAuth();
  } catch (e) {
    printResult(e);
  }
}

async function printResult(result) {
  const outputElement = window.document.getElementById("output");
  if (result instanceof Error) {
    if (outputElement) {
      const escapedMessage = escapeHTML(result.message);
      const escapedStack = escapeHTML(result.stack);
      outputElement.innerHTML = `<code>\nError: ${escapedMessage}\nStack: ${escapedStack}</co>`;
    }
  } else {
    outputElement.innerHTML = "\n" + JSON.stringify(result, null, 2);
  }
}

const msgListener = msg => {
	console.log('Add Message', msg._id);
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
		console.log('auth change', !!user)
		showAuth(user)
		if (user) {
			api.connect()
				.then(() => {
					api.addMessageListener(msgListener);
				})
		} else {
			api.removeMessageListener(msgListener);
		}

		console.log(api.auth.authListeners.length);
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
	document
    .getElementById("loginWithRocketChatOAuth")
    .addEventListener("click", loginWithRocketChatOAuth);

	const hostInput = document.getElementById("hostUrl")
	const roomInput = document.getElementById("roomId")
	const host = hostInput.value;
	const room = roomInput.value;
	api = new EmbeddedChatApi(host, room, { deleteToken, getToken, saveToken });
	hostInput.addEventListener("change", onConfigChange);
	onConfigChange();
	
	document.getElementById("logoutBtn").addEventListener("click", () => api.auth.logout())
	document.getElementById("call-api").addEventListener("click", callApi)
	const passwordField = document.getElementById('password')
	const togglePassword = document.getElementById('togglePassword')
	togglePassword.addEventListener('click',() => toggle(passwordField, togglePassword))
})

let isPasswordVisible = false

const toggle = (passwordField, togglePassword) => {
	isPasswordVisible = !isPasswordVisible

	if(isPasswordVisible){
		passwordField.type = "text"
		togglePassword.innerHTML = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.012 9.964 7.183a1.012 1.012 0 0 1 0 .639C20.575 16.488 16.638 19.5 12 19.5c-4.638 0-8.575-3.012-9.964-7.183ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
				/>
			</svg>
		`;
	} else {
		passwordField.type = "password";	

		togglePassword.innerHTML = `
			<svg
				height="20"
				width="20"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
				/>
			</svg>
		`;
	}	
}

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[
        tag
      ] || tag)
  );
}
