// @ts-expect-error no types served yet
import { EmbeddedChat } from "@embeddedchat/react";

function App() {
  const host = import.meta.env.VITE_RC_HOST || "http://127.0.0.1:3000";

  return (
    <EmbeddedChat
      host={host}
      roomId="66ccc4f1e050428c76256939"
    />
  );
}

export default App;
