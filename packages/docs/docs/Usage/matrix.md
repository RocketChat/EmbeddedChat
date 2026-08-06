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

## User Experience & Customization

### 1. Matrix Theme Customization
When integrating the widget, using `theme="matrix"` automatically applies the HSL palette inspired by Element Web:
- **Brand Accent (Emerald Green)**: `#0dbd8b` (`hsl(163, 88%, 41%)`)
- **Dark Mode Background (Charcoal Slate)**: `#15191e` (`hsl(216, 18%, 10%)`)
- **Light Mode Background (Pure White)**: `#ffffff`
- **Typography**: Clean, readable sans-serif layout using `"Inter", "Helvetica Neue", sans-serif` for all UI components.

### 2. Timeline Layout Mode
Configuring `layoutMode="timeline"` replaces standard message bubbles with a flat, continuous design:
- Message bubbles are removed, allowing messages to span the full width of the container.
- Consecutive messages from the same sender are clustered together under a single name/timestamp header with reduced vertical padding.
- Active messages are highlighted on hover with a theme-colored left border.

### 3. Federated Room & User Badges
To help users identify federated communication:
- **Federated Room Indicator**: A globe icon is displayed in the widget header in place of the standard `#` or private lock icon to show the room is federated.
- **Server Origin Badges**: External federated users (usernames containing colons, e.g. `@user:matrix.org`) automatically get an emerald-bordered badge next to their username showing their remote domain (e.g. `matrix.org`).
