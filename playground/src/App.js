import "./App.css";
import "@rocket.chat/icons/dist/rocketchat.css";
import { RCComponent } from "rc-component-react";
import { useState } from "react";

function App() {
  const [closed, setClosable] = useState(false);
  return (
    <div>
      {closed ? (
        <button onClick={() => setClosable((prev) => !prev)}>open</button>
      ) : (
        <RCComponent isClosable={true} setClosableState={setClosable} moreOpts={true} />
      )}
    </div>
  );
}

export default App;
