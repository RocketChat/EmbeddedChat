/**
 * @jest-environment jsdom
 */
/* global describe, test, expect, jest, beforeEach, afterEach, document */
global.IS_REACT_ACT_ENVIRONMENT = true;
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import RCContext from '../context/RCInstance';
import { useUserStore } from '../store';
import useFetchChatData from './useFetchChatData';

describe('useFetchChatData permissions caching', () => {
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

  test('caches permissions raw data and avoids redundant re-processing on unchanged permissions', async () => {
    const mockPermissions = {
      update: [
        { _id: 'view-full-other-user-info', roles: ['admin', 'user'] },
        { _id: 'delete-message', roles: ['admin'] },
      ],
    };

    mockRCInstance.permissionInfo.mockResolvedValue(mockPermissions);

    const spySetViewUserInfo = jest.fn();
    useUserStore.setState({
      setViewUserInfoPermissions: spySetViewUserInfo,
    });

    await renderWithContext();

    // First call: initial fetch and cache
    await act(async () => {
      await hookResult.current.fetchAndSetPermissions();
    });

    expect(mockRCInstance.permissionInfo).toHaveBeenCalledTimes(1);
    expect(hookResult.current.permissionsRef.current.raw).toEqual(
      mockPermissions
    );
    expect(spySetViewUserInfo).toHaveBeenCalledTimes(1);

    // Second call with same permissions: should use cached raw data without re-applying
    await act(async () => {
      await hookResult.current.fetchAndSetPermissions();
    });

    expect(mockRCInstance.permissionInfo).toHaveBeenCalledTimes(2);
    // Setter should not be called again because raw data is identical
    expect(spySetViewUserInfo).toHaveBeenCalledTimes(1);

    // Third call with changed permissions: should update cache and re-apply
    const updatedPermissions = {
      update: [
        {
          _id: 'view-full-other-user-info',
          roles: ['admin', 'user', 'guest'],
        },
        { _id: 'delete-message', roles: ['admin'] },
      ],
    };
    mockRCInstance.permissionInfo.mockResolvedValue(updatedPermissions);

    await act(async () => {
      await hookResult.current.fetchAndSetPermissions();
    });

    expect(mockRCInstance.permissionInfo).toHaveBeenCalledTimes(3);
    expect(hookResult.current.permissionsRef.current.raw).toEqual(
      updatedPermissions
    );
    expect(spySetViewUserInfo).toHaveBeenCalledTimes(2);
  });
});
