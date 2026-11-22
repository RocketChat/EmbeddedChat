/* eslint-env jest */
import useMessageStore from './messageStore';

const initialState = useMessageStore.getState();
const parent = { _id: 'parent', msg: 'Parent message' };
const reply = { _id: 'reply', tmid: parent._id, msg: 'Reply' };
const other = { _id: 'other', msg: 'Other message' };

beforeEach(() => {
  useMessageStore.setState(initialState, true);
});

describe('removeMessage', () => {
  test.each([true, false])(
    'closes and clears the deleted parent thread (parent in message list: %s)',
    (includeParent) => {
      const { setMessages, openThread, setThreadMessages, removeMessage } =
        useMessageStore.getState();
      setMessages(includeParent ? [parent, other] : [other]);
      openThread(parent);
      setThreadMessages([reply]);

      removeMessage(parent._id);

      expect(useMessageStore.getState()).toMatchObject({
        messages: [other],
        deletedMessage: parent,
        isThreadOpen: false,
        threadMainMessage: null,
        threadMessages: [],
      });
    }
  );

  test.each(['reply', 'other', 'unknown'])(
    'preserves the active thread when removing %s',
    (messageId) => {
      const { setMessages, openThread, setThreadMessages, removeMessage } =
        useMessageStore.getState();
      setMessages([parent, other]);
      openThread(parent);
      setThreadMessages([reply]);

      removeMessage(messageId);

      expect(useMessageStore.getState()).toMatchObject({
        messages: messageId === other._id ? [parent] : [parent, other],
        isThreadOpen: true,
        threadMainMessage: parent,
        threadMessages: messageId === reply._id ? [] : [reply],
        deletedMessage:
          { reply, other }[messageId] || initialState.deletedMessage,
      });
    }
  );

  test('ignores unknown deletions in an empty store', () => {
    const state = useMessageStore.getState();

    state.removeMessage('unknown');

    expect(useMessageStore.getState()).toBe(state);
  });

  test('handles repeated parent deletion events', () => {
    const { setMessages, openThread, removeMessage } =
      useMessageStore.getState();
    setMessages([parent]);
    openThread(parent);
    removeMessage(parent._id);
    const state = useMessageStore.getState();

    removeMessage(parent._id);

    expect(useMessageStore.getState()).toBe(state);
  });
});
