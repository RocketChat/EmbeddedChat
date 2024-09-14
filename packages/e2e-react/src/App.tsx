// @ts-expect-error no types served yet
import { EmbeddedChat } from "@embeddedchat/react";

function App() {
  return (
    <EmbeddedChat
      host="https://demo.qa.rocket.chat/"
      roomId="66ccc4f1e050428c76256939"
    />
  );
}

export default App;
