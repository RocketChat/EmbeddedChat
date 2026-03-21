import useMessageStore from './messageStore';

describe('messageStore Memory Cap', () => {
  beforeEach(() => {
    useMessageStore.setState({ messages: [] });
  });

  test('caps messages at 500 when using setMessages', () => {
    const initialMessages = Array.from({ length: 550 }, (_, i) => ({
      _id: `msg-${i}`,
      ts: new Date(Date.now() + i * 1000).toISOString(),
      msg: `Message ${i}`,
    }));

    // Reset store
    useMessageStore.getState().setMessages([], false);

    // Set 550 messages
    useMessageStore.getState().setMessages(initialMessages, false);

    const storedMessages = useMessageStore.getState().messages;

    expect(storedMessages.length).toBe(500);
    // Should keep the NEWEST 500.
    // initialMessages[549] is the newest.
    // initialMessages[50] to [549] should be kept?
    // The cap logic is slice(-500).
    expect(storedMessages[storedMessages.length - 1]._id).toBe('msg-549');
    expect(storedMessages[0]._id).toBe('msg-50');
  });

  test('caps messages at 500 when appending', () => {
    // Start with 490 messages
    const oldMessages = Array.from({ length: 490 }, (_, i) => ({
      _id: `old-${i}`,
      ts: new Date(Date.now() + i * 1000).toISOString(),
      msg: `Old ${i}`,
    }));
    useMessageStore.getState().setMessages(oldMessages, false);

    // Append 20 messages (total 510)
    const newMessages = Array.from({ length: 20 }, (_, i) => ({
      _id: `new-${i}`,
      ts: new Date(Date.now() + (500 + i) * 1000).toISOString(),
      msg: `New ${i}`,
    }));

    useMessageStore.getState().setMessages(newMessages, true);

    const storedMessages = useMessageStore.getState().messages;
    expect(storedMessages.length).toBe(500);

    // Last message should be new-19
    expect(storedMessages[storedMessages.length - 1]._id).toBe('new-19');

    // First message should satisfy dropped count.
    // Total 510. Dropped 10.
    // Dropped old-0 to old-9.
    // First should be old-10.
    expect(storedMessages[0]._id).toBe('old-10');
  });

  test('sorts messages by timestamp', () => {
    const msg1 = { _id: '1', ts: '2023-01-01T10:00:00Z' };
    const msg2 = { _id: '2', ts: '2023-01-01T12:00:00Z' };
    const msg3 = { _id: '3', ts: '2023-01-01T11:00:00Z' };

    // Insert out of order
    useMessageStore.getState().setMessages([msg2, msg1, msg3], false);

    const storedMessages = useMessageStore.getState().messages;
    expect(storedMessages[0]._id).toBe('1');
    expect(storedMessages[1]._id).toBe('3');
    expect(storedMessages[2]._id).toBe('2');
  });
});
