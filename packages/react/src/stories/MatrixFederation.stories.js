import React from 'react';
import Message from '../views/Message/Message';
import { RCInstanceProvider } from '../context/RCInstance';
import { 
  ThemeProvider, 
  ToastBarProvider, 
  Box 
} from '@embeddedchat/ui-elements';
import GlobalStyles from '../views/GlobalStyles';
import DefaultTheme from '../theme/DefaultTheme';

export default {
  title: 'EmbeddedChat/POC: Matrix Federation',
  component: Message,
};

const mockMatrixMessage = {
  _id: 'matrix-msg-id',
  rid: 'GENERAL',
  msg: 'Hello from the Matrix! This message is coming from a federated homeserver.',
  ts: new Date().toISOString(),
  u: {
    _id: 'federated-user-id',
    username: '@vivek:matrix.org',
    name: 'Vivek (Matrix)',
  },
};

const mockNormalMessage = {
  _id: 'normal-msg-id',
  rid: 'GENERAL',
  msg: 'Hi! I am a normal Rocket.Chat user.',
  ts: new Date().toISOString(),
  u: {
    _id: 'normal-user-id',
    username: 'vivekyadav',
    name: 'Vivek Yadav',
  },
};

export const FederatedUser = () => (
  <ThemeProvider theme={DefaultTheme}>
    <GlobalStyles />
    <RCInstanceProvider value={{ 
        RCInstance: { 
            auth: { onAuthChange: () => {} }, 
            getHost: () => 'http://localhost:3000',
            starMessage: () => {},
            pinMessage: () => {},
        }, 
        ECOptions: { showAvatar: true, showRoles: true, showUsername: true, showName: true } 
    }}>
      <ToastBarProvider>
        <div style={{ padding: '2rem', background: 'white', minHeight: '100vh' }}>
            <h3>Federated vs Normal Message Comparison</h3>
            <p style={{ color: '#666' }}>Notice the purple Matrix badge on the federated user identifier.</p>
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', maxWidth: '600px' }}>
                <Message message={mockMatrixMessage} showAvatar={true} showRoles={true} />
                <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid #eee' }} />
                <Message message={mockNormalMessage} showAvatar={true} showRoles={true} />
            </div>
        </div>
      </ToastBarProvider>
    </RCInstanceProvider>
  </ThemeProvider>
);
