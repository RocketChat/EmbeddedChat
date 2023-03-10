import './App.css';
import '@rocket.chat/icons/dist/rocketchat.css';
import { RCComponent } from 'embeddedchat';
import { useState } from 'react';

function App() {
  const [closed, setClosable] = useState(false);
  return (
    <div>
      {closed ? (
        <button onClick={() => setClosable((prev) => !prev)}>open</button>
      ) : (
        <RCComponent
          host={process.env.REACT_APP_RC_HOST}
          roomId={process.env.REACT_APP_RC_ROOM_ID}
          GOOGLE_CLIENT_ID={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          isClosable={true}
          setClosableState={setClosable}
          moreOpts={true}
          channelName="general"
          anonymousMode={true}
          headerColor="white"
          toastBarPosition="bottom-end"
          showRoles={true}
          showAvatar={false}
          enableThreads
        />
      )}
    </div>
  );
}

export default App;
