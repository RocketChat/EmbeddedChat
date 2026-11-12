import assert from "node:assert/strict";
import test from "node:test";

import EmbeddedChatApi from "../dist/EmbeddedChatApi.test.mjs";

const withTimeout = (promise, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), 250)
    ),
  ]);

const createApi = () => {
  const api = Object.create(EmbeddedChatApi.prototype);
  let connectCalls = 0;
  let loginCalls = 0;
  let currentUser = { authToken: "old-token", userId: "old-user" };
  let resolveFirstHandshake;
  const firstHandshake = new Promise((resolve) => {
    resolveFirstHandshake = resolve;
  });

  Object.assign(api, {
    rid: "room-id",
    _connectPromise: null,
    _cancelConnect: null,
    _activeSubscriptions: [],
    _connectionGeneration: 0,
    onMessageCallbacks: [],
    onMessageDeleteCallbacks: [],
    onTypingStatusCallbacks: [],
    onActionTriggeredCallbacks: [],
    onUiInteractionCallbacks: [],
    typingUsers: [],
    auth: {
      logout: async () => {
        currentUser = null;
      },
      getCurrentUser: async () => currentUser,
    },
    joinRoom: async () => undefined,
    sdk: {
      connection: {
        connect: () => {
          connectCalls += 1;
          return connectCalls === 1 ? firstHandshake : Promise.resolve();
        },
        close: () => undefined,
      },
      account: {
        uid: null,
        loginWithToken: async () => {
          loginCalls += 1;
        },
      },
      rest: { setCredentials: () => undefined },
      stream: () => ({ stop: () => undefined }),
    },
  });

  return {
    api,
    getConnectCalls: () => connectCalls,
    getLoginCalls: () => loginCalls,
    login: () => {
      currentUser = { authToken: "new-token", userId: "new-user" };
    },
    resolveFirstHandshake,
  };
};

test("logout during handshake allows the next login to reconnect", async () => {
  const { api, getConnectCalls, getLoginCalls, login, resolveFirstHandshake } =
    createApi();

  const interruptedConnect = api.connect();
  assert.equal(getConnectCalls(), 1);

  await api.logout();
  await withTimeout(
    interruptedConnect,
    "the interrupted connection did not settle"
  );

  login();
  await withTimeout(api.connect(), "the next connection did not settle");
  assert.equal(getConnectCalls(), 2);
  assert.equal(getLoginCalls(), 1);

  // Let the abandoned DDP promise settle and verify its finalizer does not
  // interfere with later connection attempts.
  resolveFirstHandshake();
  await Promise.resolve();
  await withTimeout(api.connect(), "a later connection did not settle");
  assert.equal(getConnectCalls(), 3);
});
