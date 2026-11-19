// Mock Rocket.Chat API and WebSocket for local testing when no live server is available

const MOCK_USER = {
  _id: "mock-user-id",
  name: "Test User",
  username: "test_acc",
  roles: ["user", "admin"],
  avatarUrl: "https://open.rocket.chat/avatar/test_acc",
};

const activeSockets = new Set<MockWebSocket>();

class MockWebSocket extends EventTarget {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(url: string | URL) {
    super();
    this.url = url.toString();
    activeSockets.add(this);

    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      const openEvent = new Event("open");
      this.dispatchEvent(openEvent);
      if (this.onopen) this.onopen(openEvent);
    }, 50);
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (typeof data !== "string") return;
    try {
      const payload = JSON.parse(data);

      if (payload.msg === "connect") {
        setTimeout(() => {
          this.emitMessage({
            msg: "connected",
            session: "mock-session-" + Math.random().toString(36).slice(2),
          });
        }, 20);
      } else if (payload.msg === "sub") {
        setTimeout(() => {
          this.emitMessage({
            msg: "ready",
            subs: [payload.id],
          });
        }, 20);
      } else if (payload.msg === "method") {
        setTimeout(() => {
          this.emitMessage({
            msg: "result",
            id: payload.id,
            result: {
              id: MOCK_USER._id,
              token: "mock-auth-token-12345",
              tokenExpires: { $date: Date.now() + 86400000 },
            },
          });
          this.emitMessage({
            msg: "updated",
            methods: [payload.id],
          });
        }, 20);
      } else if (payload.msg === "ping") {
        setTimeout(() => {
          this.emitMessage({ msg: "pong" });
        }, 10);
      }
    } catch {
      // ignore
    }
  }

  emitMessage(obj: unknown) {
    if (this.readyState !== MockWebSocket.OPEN) return;
    const msgEvent = new MessageEvent("message", {
      data: JSON.stringify(obj),
    });
    this.dispatchEvent(msgEvent);
    if (this.onmessage) this.onmessage(msgEvent);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    activeSockets.delete(this);
    const closeEvent = new CloseEvent("close");
    this.dispatchEvent(closeEvent);
    if (this.onclose) this.onclose(closeEvent);
  }
}

// Intercept WebSocket if connecting to rocket.chat or localhost:3000
const OriginalWebSocket = window.WebSocket;
window.WebSocket = function (url: string | URL, protocols?: string | string[]) {
  const urlStr = url.toString();
  if (
    urlStr.includes("localhost:3000") ||
    urlStr.includes("rocket.chat") ||
    urlStr.includes("/websocket")
  ) {
    return new MockWebSocket(url) as unknown as WebSocket;
  }
  return new OriginalWebSocket(url, protocols);
} as unknown as typeof WebSocket;
Object.assign(window.WebSocket, OriginalWebSocket);

// Intercept Fetch for REST APIs
const originalFetch = window.fetch.bind(window);

let mockMessages = [
  {
    _id: "welcome-msg-1",
    rid: "GENERAL",
    msg: "Welcome to EmbeddedChat! You are logged in as test_acc.",
    ts: new Date().toISOString(),
    u: {
      _id: MOCK_USER._id,
      username: MOCK_USER.username,
      name: MOCK_USER.name,
    },
  },
];

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

  const isRcRequest =
    url.includes("localhost:3000") ||
    url.includes("rocket.chat") ||
    url.includes("/api/v1") ||
    url.includes("/v1/");

  if (!isRcRequest) {
    return originalFetch(input, init);
  }

  const jsonResponse = (data: unknown, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  };

  // 1. Login
  if (url.includes("/api/v1/login")) {
    return jsonResponse({
      status: "success",
      data: {
        authToken: "mock-auth-token-12345",
        userId: MOCK_USER._id,
        me: MOCK_USER,
      },
    });
  }

  // 2. Current User / Me
  if (url.includes("/api/v1/me") || url.includes("/v1/me")) {
    return jsonResponse({
      success: true,
      ...MOCK_USER,
    });
  }

  // 3. Room info
  if (url.includes("/v1/rooms.info")) {
    return jsonResponse({
      success: true,
      room: {
        _id: "GENERAL",
        name: "general",
        t: "c",
        msgs: mockMessages.length,
        usersCount: 1,
      },
    });
  }

  // 4. Messages
  if (url.includes("/channels.messages") || url.includes("/groups.messages")) {
    return jsonResponse({
      success: true,
      messages: mockMessages,
      count: mockMessages.length,
    });
  }

  // 5. Send message
  if (url.includes("/v1/chat.sendMessage")) {
    let text = "Hello!";
    try {
      if (init?.body) {
        const parsed = JSON.parse(init.body as string);
        text = parsed?.message?.msg || text;
      }
    } catch (_e) {
      // ignore parse error
    }

    const newMsg = {
      _id: "msg-" + Date.now(),
      rid: "GENERAL",
      msg: text,
      ts: new Date().toISOString(),
      u: {
        _id: MOCK_USER._id,
        username: MOCK_USER.username,
        name: MOCK_USER.name,
      },
    };
    mockMessages = [newMsg, ...mockMessages];

    // Broadcast message to active WebSockets
    activeSockets.forEach((ws) => {
      ws.emitMessage({
        msg: "changed",
        collection: "stream-room-messages",
        id: "id",
        fields: {
          eventName: "GENERAL",
          args: [newMsg],
        },
      });
    });

    return jsonResponse({
      success: true,
      message: newMsg,
    });
  }

  // 6. Permissions
  if (url.includes("/v1/permissions.listAll")) {
    return jsonResponse({
      success: true,
      update: [],
    });
  }

  // 7. Roles
  if (url.includes("/roles")) {
    return jsonResponse({
      success: true,
      roles: [],
      result: [],
    });
  }

  // 8. Members
  if (url.includes("/members")) {
    return jsonResponse({
      success: true,
      members: [
        {
          _id: MOCK_USER._id,
          username: MOCK_USER.username,
          name: MOCK_USER.name,
          status: "online",
        },
      ],
    });
  }

  // 9. Settings
  if (url.includes("/settings/Message_MaxAllowedSize")) {
    return jsonResponse({
      success: true,
      value: 5000,
    });
  }

  // 10. Commands
  if (url.includes("/v1/commands.list")) {
    return jsonResponse({
      success: true,
      commands: [],
    });
  }

  // 11. Generic fallback for other RocketChat endpoints
  return jsonResponse({
    success: true,
  });
};

export {};
