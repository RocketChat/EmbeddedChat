/* eslint-env jest */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useToastBarDispatch } from '@embeddedchat/ui-elements';
import useMessageStore from '../store/messageStore';
import useThreadDeletionToast from './useThreadDeletionToast';

jest.mock('@embeddedchat/ui-elements', () => ({
  useToastBarDispatch: jest.fn(),
}));

const initialState = useMessageStore.getState();
const parent = { _id: 'parent', msg: 'Parent message' };
const reply = { _id: 'reply', tmid: 'parent', msg: 'Reply' };
const other = { _id: 'other', msg: 'Other message' };
const Observer = () => {
  useThreadDeletionToast();
  return null;
};

describe('thread deletion notification', () => {
  let container;
  let root;
  let dispatch;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    useMessageStore.setState(initialState, true);
    dispatch = jest.fn();
    useToastBarDispatch.mockReturnValue(dispatch);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() =>
      root.render(
        <React.StrictMode>
          <Observer />
        </React.StrictMode>
      )
    );
    const state = useMessageStore.getState();
    state.setMessages([parent, other]);
    state.openThread(parent);
    state.setThreadMessages([reply]);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  test.each([true, false])(
    'notifies once when deleting the active parent (loaded: %s)',
    (loaded) => {
      if (!loaded) useMessageStore.getState().setMessages([other]);
      act(() => useMessageStore.getState().removeMessage(parent._id));
      act(() => useMessageStore.getState().removeMessage(parent._id));
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: 'info',
        message:
          'This thread was closed because its parent message was deleted.',
      });
      expect(useMessageStore.getState()).toMatchObject({
        isThreadOpen: false,
        threadMainMessage: null,
        threadMessages: [],
      });
    }
  );

  test.each(['reply', 'other', 'unknown'])(
    'does not notify for %s deletion',
    (id) => {
      act(() => useMessageStore.getState().removeMessage(id));
      expect(dispatch).not.toHaveBeenCalled();
      expect(useMessageStore.getState().isThreadOpen).toBe(true);
    }
  );

  test('does not notify for a manually closed thread, even after a prior deletion', () => {
    act(() => useMessageStore.getState().removeMessage(parent._id));
    dispatch.mockClear();
    act(() => useMessageStore.getState().openThread(parent));
    act(() => useMessageStore.getState().closeThread());
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('unsubscribes when unmounted', () => {
    act(() => root.render(null));
    act(() => useMessageStore.getState().removeMessage(parent._id));
    expect(dispatch).not.toHaveBeenCalled();
  });
});
