---
title: Matrix Integration
---

# Matrix Federation Integration

EmbeddedChat features native support for **Matrix Federation**, enabling seamless real-time communication with users on external Matrix servers (such as `matrix.org`). 

Through this integration, your EmbeddedChat instance behaves like a modern Matrix client: displaying Matrix-styled user interfaces, handling federated message styling, and routing room join handshakes through Rocket.Chat's native Matrix gateway.

![EmbeddedChat Matrix Demo](https://github.com/user-attachments/assets/d1ec8072-4618-4af6-b13f-ef3046502dd1)

---

## Key Features

- **Matrix Theme (`theme="matrix"`)**: An Element-inspired styling scheme featuring emerald green brand colors (`#0dbd8b`) and a sleek charcoal dark mode (`#15191e`).
- **Timeline Layout Mode (`layoutMode="timeline"`)**: A flat, bubble-less, consecutive message layout reminiscent of classic chat and modern Matrix/Element clients.
- **Federated Status Badge**: A header indicator detailing the federated status of the channel and its origin homeserver.
- **Server Origin Badges**: Visual badges on message headers identifying external homeservers (e.g., `matrix.org`, `envs.net`) for federated users.
- **Proxy-based Federation Join**: Intelligent routing for room-join requests, automatically detecting federated room metadata and invoking the Matrix federation join API endpoint.

---

## Configuration & Usage

To configure the Matrix visual style and enable federation styling, pass the following props to the `EmbeddedChat` component:

```jsx
import { EmbeddedChat } from '@embeddedchat/react';

function App() {
  return (
    <EmbeddedChat
      host="https://your-rocketchat-server.com"
      roomId="YOUR_FEDERATED_ROOM_ID"
      theme="matrix"
      dark={true}
      layoutMode="timeline"
    />
  );
}
```

### Prop Details

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theme` | `string` | `null` | Pass `"matrix"` to load the Element-inspired theme. |
| `dark` | `boolean` | `false` | Enable dark mode. When paired with `theme="matrix"`, this renders the charcoal dark aesthetic (`#15191e`). |
| `layoutMode` | `"default" \| "timeline"` | `"default"` | Set to `"timeline"` to enable the flat, compact message layout with a left hover border accent. |

---

## Architectural Details

### 1. Matrix Theme (`MatrixTheme.js`)
The Matrix Theme configures a tailored HSL color palette mapping exactly to Element Web's color tokens:
- **Brand Green**: `hsl(163, 88%, 40%)` (`#0dbd8b`)
- **Dark Background**: `hsl(216, 17%, 10%)` (`#15191e`)
- **Message Cards / Popovers**: `hsl(220, 12%, 20%)` (`#2c3038`)
- **Border / Outline Lines**: `hsl(215, 11%, 25%)` (`#394049`)

### 2. Timeline Layout Mode
When `layoutMode` is set to `timeline`, the following UI transformations occur:
- Message bubbles are hidden, and messages span the entire width of the container.
- Consecutive messages from the same sender are clustered with tighter vertical spacing.
- An emerald left-accent border highlights the active message on hover.

### 3. Visual Badging & Indicators
- **Header Pill**: If a room contains federation metadata, a globe icon alongside a green pill (`matrix:origin-server`) is rendered in the `ChatHeader`.
- **Message Sender Badge**: External federated users are identified using the format `@username:homeserver.org`. If the sender's homeserver differs from the local homeserver, a subtle green outlined badge displaying the remote domain (e.g. `matrix.org`) is shown next to their display name.

### 4. Dynamic Federation Joining
When a user attempts to join a room, `joinRoom` in `EmbeddedChatApi.ts` checks the room's metadata:
- If the room is detected as federated (`isFederated` is true) and has a valid Matrix Room ID (`mrid`), the client routes the request via:
  ```http
  POST /api/v1/federation/joinExternalPublicRoom
  ```
- This ensures that local users self-joining a federated room are correctly registered across the Matrix homeserver network and prevent subscription desynchronization.

---

## Testing in Development

You can test the Matrix integration via Storybook. Run:

```bash
yarn storybook
```

In the Storybook sidebar, navigate to **EmbeddedChat / WithMatrix**. The mock configuration demonstrates:
- A pre-configured federated room ID.
- Element color theme and timeline mode active.
- Correct rendering of external message badges and federated header states.
