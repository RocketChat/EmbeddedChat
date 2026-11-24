/* eslint-env jest */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { EmbeddedChat } from './index';

jest.mock('@embeddedchat/ui-kit', () => ({
  parseGeneratedUiConfigurations: jest.fn(() => ({
    configurations: [],
    errors: [],
  })),
}));

jest.mock('@embeddedchat/api', () => ({
  EmbeddedChatApi: jest.fn().mockImplementation(() => ({
    autoLogin: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    auth: {
      onAuthChange: jest.fn(),
      removeAuthListener: jest.fn(),
    },
  })),
}));
jest.mock('./views/ChatLayout', () => ({ ChatLayout: () => null }));
jest.mock('./views/ChatHeader', () => ({ ChatHeader: () => null }));

describe('Rendering of EmbeddedChat', () => {
  let container;
  let root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  test('renders the EmbeddedChat component', async () => {
    await act(async () => root.render(<EmbeddedChat />));

    expect(container.querySelector('.ec-embedded-chat')).not.toBeNull();
  });

  test('rejects an explicitly missing close callback when closable', () => {
    expect(() =>
      act(() =>
        root.render(<EmbeddedChat isClosable setClosableState={null} />)
      )
    ).toThrow(
      'Please provide a setClosableState to props when isClosable = true'
    );
  });
});
