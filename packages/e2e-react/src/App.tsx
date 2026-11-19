// @ts-expect-error no types served yet
import { EmbeddedChat } from "@embeddedchat/react";

function App() {
  return <EmbeddedChat host="http://localhost:3000" roomId="GENERAL" />;
}

export default App;
