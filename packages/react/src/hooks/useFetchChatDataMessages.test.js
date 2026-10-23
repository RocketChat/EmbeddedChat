/**
 * @jest-environment jsdom
 */
/* global describe, test, expect, jest, beforeEach, afterEach, document */
global.IS_REACT_ACT_ENVIRONMENT = true;
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import RCContext from '../context/RCInstance';
import {
  useUserStore,
  useStarredMessageStore,
  usePinnedMessageStore,
} from '../store';
import useFetchChatData from './useFetchChatData';

describe('useFetchChatData messages fetching in anonymousMode', () => {
  let mockRCInstance;
  let hookResult;
  let container;
  let root;

  const TestHarness = ({ showRoles = false }) => {
    hookResult.current = useFetchChatData(showRoles);
    return null;
  };

  const renderWithContext = async (showRoles = false) => {
    hookResult = { current: null };
    await act(async () => {
      root.render(
        React.createElement(
          RCContext.Provider,
          { value: { RCInstance: mockRCInstance } },
          React.createElement(TestHarness, { showRoles })
        )
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    mockRCInstance = {
      permissionInfo: jest.fn(),
      getStarredMessages: jest.fn(),
      getPinnedMessages: jest.fn(),
      getMessages: jest.fn(),
    };

    useUserStore.setState({
      isUserAuthenticated: false,
      viewUserInfoPermissions: {},
    });

    useStarredMessageStore.setState({
      starredMessages: [],
    });

    usePinnedMessageStore.setState({
      pinnedMessages: [],
    });
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root.unmount();
      });
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('getStarredMessages', () => {
    test('does not fetch starred messages when unauthenticated and anonymousMode is false', async () => {
      useUserStore.setState({ isUserAuthenticated: false });
      await renderWithContext();

      await act(async () => {
        await hookResult.current.getStarredMessages(false);
      });

      expect(mockRCInstance.getStarredMessages).not.toHaveBeenCalled();
    });

    test('fetches starred messages when unauthenticated and anonymousMode is true', async () => {
      useUserStore.setState({ isUserAuthenticated: false });
      const mockMessages = [{ _id: 'msg-star-1', msg: 'Starred text' }];
      mockRCInstance.getStarredMessages.mockResolvedValue({
        messages: mockMessages,
      });

      await renderWithContext();

      await act(async () => {
        await hookResult.current.getStarredMessages(true);
      });

      expect(mockRCInstance.getStarredMessages).toHaveBeenCalledTimes(1);
      expect(useStarredMessageStore.getState().starredMessages).toEqual(
        mockMessages
      );
    });

    test('fetches starred messages when authenticated', async () => {
      useUserStore.setState({ isUserAuthenticated: true });
      const mockMessages = [{ _id: 'msg-star-2', msg: 'Auth starred text' }];
      mockRCInstance.getStarredMessages.mockResolvedValue({
        messages: mockMessages,
      });

      await renderWithContext();

      await act(async () => {
        await hookResult.current.getStarredMessages(false);
      });

      expect(mockRCInstance.getStarredMessages).toHaveBeenCalledTimes(1);
      expect(useStarredMessageStore.getState().starredMessages).toEqual(
        mockMessages
      );
    });
  });

  describe('getPinnedMessages', () => {
    test('does not fetch pinned messages when unauthenticated and anonymousMode is false', async () => {
      useUserStore.setState({ isUserAuthenticated: false });
      await renderWithContext();

      await act(async () => {
        await hookResult.current.getPinnedMessages(false);
      });

      expect(mockRCInstance.getPinnedMessages).not.toHaveBeenCalled();
    });

    test('fetches pinned messages when unauthenticated and anonymousMode is true', async () => {
      useUserStore.setState({ isUserAuthenticated: false });
      const mockMessages = [{ _id: 'msg-pin-1', msg: 'Pinned text' }];
      mockRCInstance.getPinnedMessages.mockResolvedValue({
        messages: mockMessages,
      });

      await renderWithContext();

      await act(async () => {
        await hookResult.current.getPinnedMessages(true);
      });

      expect(mockRCInstance.getPinnedMessages).toHaveBeenCalledTimes(1);
      expect(usePinnedMessageStore.getState().pinnedMessages).toEqual(
        mockMessages
      );
    });

    test('fetches pinned messages when authenticated', async () => {
      useUserStore.setState({ isUserAuthenticated: true });
      const mockMessages = [{ _id: 'msg-pin-2', msg: 'Auth pinned text' }];
      mockRCInstance.getPinnedMessages.mockResolvedValue({
        messages: mockMessages,
      });

      await renderWithContext();

      await act(async () => {
        await hookResult.current.getPinnedMessages(false);
      });

      expect(mockRCInstance.getPinnedMessages).toHaveBeenCalledTimes(1);
      expect(usePinnedMessageStore.getState().pinnedMessages).toEqual(
        mockMessages
      );
    });
  });
});
