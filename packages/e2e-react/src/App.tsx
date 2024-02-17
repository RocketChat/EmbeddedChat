// @ts-expect-error no types served yet
import { EmbeddedChat } from "@embeddedchat/react/dist/esm/index.js";

function App() {
  return (
    <EmbeddedChat
      host="https://chat.avitechlab.com"
      roomId="GENERAL"
      anonymousMode={true}
    />
  );
}

export default App;
