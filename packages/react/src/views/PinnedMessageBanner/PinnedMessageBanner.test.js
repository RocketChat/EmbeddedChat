import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import PinnedMessageBanner from './PinnedMessageBanner';
import usePinnedMessageStore from '../../store/pinnedMessageStore';
import RCContext from '../../context/RCInstance';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock UI elements theme hook
jest.mock('@embeddedchat/ui-elements', () => {
  const actual = jest.requireActual('@embeddedchat/ui-elements');
  return {
    ...actual,
    useTheme: () => ({
      theme: {
        radius: '4px',
        colors: {
          foreground: '#000000',
          background: '#ffffff',
          primary: '#1d74f5',
          secondary: '#f0f0f0',
          muted: '#e0e0e0',
          mutedForeground: '#666666',
          border: '#cccccc',
        },
      },
      mode: 'light',
    }),
    useComponentOverrides: () => ({ classNames: '', styleOverrides: {} }),
  };
});

describe('PinnedMessageBanner', () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [],
        dismissedRooms: {},
        showPinned: false,
      });
    });
  });

  afterEach(() => {
    act(() => {
      if (root) {
        root.unmount();
      }
    });
    if (container) {
      container.remove();
    }
  });

  const renderBanner = (ecoOptionsOverrides = {}) => {
    const mockRCContext = {
      RCInstance: { rid: 'room-1' },
      ECOptions: {
        showPinnedBanner: true,
        roomId: 'room-1',
        ...ecoOptionsOverrides,
      },
    };

    act(() => {
      root.render(
        <RCContext.Provider value={mockRCContext}>
          <PinnedMessageBanner />
        </RCContext.Provider>
      );
    });
  };

  test('does not render when there are no pinned messages', () => {
    renderBanner();
    expect(container.querySelector('.ec-pinned-message-banner')).toBeNull();
  });

  test('does not render when showPinnedBanner option is false', () => {
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-1',
            msg: 'Pinned message text',
            u: { username: 'alice' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner({ showPinnedBanner: false });
    expect(container.querySelector('.ec-pinned-message-banner')).toBeNull();
  });

  test('renders pin icon, author username, and snippet for a single pinned message', () => {
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-1',
            msg: 'Welcome to Rocket.Chat embedded channel!',
            u: { username: 'alice' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner();

    const banner = container.querySelector('.ec-pinned-message-banner');
    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain('alice:');
    expect(banner.textContent).toContain(
      'Welcome to Rocket.Chat embedded channel!'
    );
    // Counter and navigation arrows should NOT be present when only 1 message is pinned
    expect(banner.textContent).not.toContain('1 / 1');
    expect(
      container.querySelector('[aria-label="Previous pinned message"]')
    ).toBeNull();
    expect(
      container.querySelector('[aria-label="Next pinned message"]')
    ).toBeNull();
  });

  test('truncates snippet longer than 80 characters with ellipsis', () => {
    const longText =
      'This is a very long pinned announcement message that exceeds eighty characters in length and therefore should be properly truncated with an ellipsis.';
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-long',
            msg: longText,
            u: { username: 'admin' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner();

    const banner = container.querySelector('.ec-pinned-message-banner');
    expect(banner.textContent).toContain('admin:');
    const expectedSnippet = `${longText.slice(0, 80)}...`;
    expect(banner.textContent).toContain(expectedSnippet);
  });

  test('cycles through multiple pinned messages with navigation buttons and updates counter', () => {
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-1',
            msg: 'First pinned item',
            u: { username: 'alice' },
            pinned: true,
          },
          {
            _id: 'msg-2',
            msg: 'Second pinned item',
            u: { username: 'bob' },
            pinned: true,
          },
          {
            _id: 'msg-3',
            msg: 'Third pinned item',
            u: { username: 'charlie' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner();

    const banner = container.querySelector('.ec-pinned-message-banner');
    expect(banner.textContent).toContain('alice:');
    expect(banner.textContent).toContain('First pinned item');
    expect(banner.textContent).toContain('1 / 3');

    const nextBtn = container.querySelector(
      '[aria-label="Next pinned message"]'
    );
    const prevBtn = container.querySelector(
      '[aria-label="Previous pinned message"]'
    );
    expect(nextBtn).not.toBeNull();
    expect(prevBtn).not.toBeNull();

    // Click next -> message 2
    act(() => {
      nextBtn.click();
    });
    expect(banner.textContent).toContain('bob:');
    expect(banner.textContent).toContain('Second pinned item');
    expect(banner.textContent).toContain('2 / 3');

    // Click next -> message 3
    act(() => {
      nextBtn.click();
    });
    expect(banner.textContent).toContain('charlie:');
    expect(banner.textContent).toContain('Third pinned item');
    expect(banner.textContent).toContain('3 / 3');

    // Click next -> wraps around to message 1
    act(() => {
      nextBtn.click();
    });
    expect(banner.textContent).toContain('alice:');
    expect(banner.textContent).toContain('1 / 3');

    // Click prev -> wraps back to message 3
    act(() => {
      prevBtn.click();
    });
    expect(banner.textContent).toContain('charlie:');
    expect(banner.textContent).toContain('3 / 3');
  });

  test('dismisses banner on close button click for the current session', () => {
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-1',
            msg: 'Dismissible pinned note',
            u: { username: 'alice' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner();
    expect(container.querySelector('.ec-pinned-message-banner')).not.toBeNull();

    const dismissBtn = container.querySelector(
      '[aria-label="Dismiss pinned banner"]'
    );
    expect(dismissBtn).not.toBeNull();

    act(() => {
      dismissBtn.click();
    });

    expect(container.querySelector('.ec-pinned-message-banner')).toBeNull();
    expect(usePinnedMessageStore.getState().dismissedRooms['room-1']).toBe(
      true
    );
  });

  test('clicking banner body scrolls to message and applies highlight class', () => {
    const mockScrollIntoView = jest.fn();
    const mockTargetElement = document.createElement('div');
    mockTargetElement.id = 'ec-message-msg-1';
    mockTargetElement.scrollIntoView = mockScrollIntoView;
    document.body.appendChild(mockTargetElement);

    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-1',
            msg: 'Click me to scroll',
            u: { username: 'alice' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner();

    const clickableBanner = container.querySelector(
      '[title="Click to view message in chat"]'
    );
    expect(clickableBanner).not.toBeNull();

    act(() => {
      clickableBanner.click();
    });

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
    expect(
      mockTargetElement.classList.contains('ec-message-highlighted')
    ).toBe(true);

    mockTargetElement.remove();
  });

  test('strips markdown formatting and handles attachment fallback', () => {
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-md',
            msg: 'Check this **bold** and *italic* [link](https://example.com)',
            u: { username: 'alice' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner();
    const banner = container.querySelector('.ec-pinned-message-banner');
    expect(banner.textContent).toContain('Check this bold and italic link');

    // Test image attachment fallback when msg is empty
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-img',
            msg: '',
            attachments: [{ image_url: 'https://example.com/photo.png' }],
            u: { username: 'bob' },
            pinned: true,
          },
        ],
      });
    });

    renderBanner();
    expect(banner.textContent).toContain('Attachment: Image');
  });

  test('opens pinned messages sidebar if target element is not rendered in DOM', () => {
    act(() => {
      usePinnedMessageStore.setState({
        pinnedMessages: [
          {
            _id: 'msg-not-in-dom',
            msg: 'Archived pinned message',
            u: { username: 'alice' },
            pinned: true,
          },
        ],
        showPinned: false,
      });
    });

    renderBanner();
    const clickableBanner = container.querySelector(
      '[title="Click to view message in chat"]'
    );
    act(() => {
      clickableBanner.click();
    });

    expect(usePinnedMessageStore.getState().showPinned).toBe(true);
  });

  test('store updatePinnedMessage and removePinnedMessage work in real-time', () => {
    const store = usePinnedMessageStore.getState();

    // Initial state empty
    expect(store.pinnedMessages).toHaveLength(0);

    // Message pinned event
    act(() => {
      store.updatePinnedMessage({
        _id: 'msg-new',
        msg: 'New pinned item',
        u: { username: 'user1' },
        pinned: true,
      });
    });
    expect(usePinnedMessageStore.getState().pinnedMessages).toHaveLength(1);
    expect(usePinnedMessageStore.getState().pinnedMessages[0].msg).toBe(
      'New pinned item'
    );

    // Message updated while pinned
    act(() => {
      usePinnedMessageStore.getState().updatePinnedMessage({
        _id: 'msg-new',
        msg: 'Updated pinned item',
        pinned: true,
      });
    });
    expect(usePinnedMessageStore.getState().pinnedMessages[0].msg).toBe(
      'Updated pinned item'
    );

    // Message unpinned
    act(() => {
      usePinnedMessageStore.getState().updatePinnedMessage({
        _id: 'msg-new',
        pinned: false,
      });
    });
    expect(usePinnedMessageStore.getState().pinnedMessages).toHaveLength(0);

    // Message deleted
    act(() => {
      usePinnedMessageStore.getState().updatePinnedMessage({
        _id: 'msg-del',
        msg: 'To be deleted',
        pinned: true,
      });
    });
    expect(usePinnedMessageStore.getState().pinnedMessages).toHaveLength(1);

    act(() => {
      usePinnedMessageStore.getState().removePinnedMessage('msg-del');
    });
    expect(usePinnedMessageStore.getState().pinnedMessages).toHaveLength(0);
  });
});
