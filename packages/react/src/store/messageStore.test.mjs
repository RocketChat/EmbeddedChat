import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

// Register ESM extension resolver to support extensionless imports in node:test
register(new URL('../../tools/esm-resolver.mjs', import.meta.url));

const { default: useMessageStore } = await import('./messageStore.js');

describe('messageStore - Real-time Thread Synchronization', () => {
  beforeEach(() => {
    // Reset message store state before each test
    useMessageStore.setState({
      messages: [],
      threadMessages: [],
      isThreadOpen: false,
      threadMainMessage: null,
      deletedMessage: {},
    });
  });

  test('upsertMessage increments parent tcount, updates tlm, and records replies when a thread message arrives', () => {
    const parent = {
      _id: 'parent-1',
      msg: 'Main discussion topic',
      u: { _id: 'user-1', username: 'alice' },
      ts: '2026-10-27T10:00:00.000Z',
    };
    useMessageStore.getState().setMessages([parent]);

    const threadReply = {
      _id: 'reply-1',
      tmid: 'parent-1',
      msg: 'First thread reply',
      u: { _id: 'user-2', username: 'bob' },
      ts: '2026-10-27T10:05:00.000Z',
    };

    useMessageStore.getState().upsertMessage(threadReply, true);

    const state = useMessageStore.getState();
    const updatedParent = state.messages.find((m) => m._id === 'parent-1');

    assert.ok(updatedParent, 'Parent message must remain in messages list');
    assert.equal(
      updatedParent.tcount,
      1,
      'Parent tcount must be incremented to 1'
    );
    assert.equal(
      updatedParent.tlm,
      '2026-10-27T10:05:00.000Z',
      'Parent tlm must be updated to reply timestamp'
    );
    assert.deepEqual(
      updatedParent.replies,
      ['user-2'],
      'Parent replies array must include the reply author'
    );
  });

  test('upsertMessage updates threadMessages and threadMainMessage when the thread is actively open', () => {
    const parent = {
      _id: 'parent-1',
      msg: 'Main thread root',
      u: { _id: 'user-1', username: 'alice' },
      ts: '2026-10-27T10:00:00.000Z',
      tcount: 0,
    };
    useMessageStore.setState({
      messages: [parent],
      isThreadOpen: true,
      threadMainMessage: parent,
      threadMessages: [],
    });

    const threadReply = {
      _id: 'reply-1',
      tmid: 'parent-1',
      msg: 'Active thread response',
      u: { _id: 'user-2', username: 'bob' },
      ts: '2026-10-27T10:02:00.000Z',
    };

    useMessageStore.getState().upsertMessage(threadReply, true);

    const state = useMessageStore.getState();
    assert.equal(
      state.threadMessages.length,
      1,
      'threadMessages should contain the new reply'
    );
    assert.equal(state.threadMessages[0]._id, 'reply-1');
    assert.equal(
      state.threadMainMessage.tcount,
      1,
      'threadMainMessage tcount must be updated'
    );
    assert.equal(state.threadMainMessage.tlm, '2026-10-27T10:02:00.000Z');
  });

  test('upsertMessage does not duplicate tcount when updating an existing thread reply', () => {
    const parent = {
      _id: 'parent-1',
      msg: 'Parent msg',
      tcount: 1,
      replies: ['user-2'],
      ts: '2026-10-27T10:00:00.000Z',
    };
    const existingReply = {
      _id: 'reply-1',
      tmid: 'parent-1',
      msg: 'Original reply text',
      u: { _id: 'user-2', username: 'bob' },
      ts: '2026-10-27T10:02:00.000Z',
    };

    useMessageStore.setState({
      messages: [parent],
      isThreadOpen: true,
      threadMainMessage: parent,
      threadMessages: [existingReply],
    });

    const editedReply = {
      ...existingReply,
      msg: 'Edited reply text',
      ts: '2026-10-27T10:03:00.000Z',
    };

    useMessageStore.getState().upsertMessage(editedReply, true);

    const state = useMessageStore.getState();
    const updatedParent = state.messages.find((m) => m._id === 'parent-1');
    assert.equal(
      updatedParent.tcount,
      1,
      'tcount should not increment when editing an existing reply'
    );
    assert.equal(
      state.threadMainMessage.tcount,
      1,
      'threadMainMessage tcount should not increment on edit'
    );
  });

  test('removeMessage decrements parent tcount when a thread message is removed', () => {
    const parent = {
      _id: 'parent-1',
      msg: 'Parent msg',
      tcount: 2,
      ts: '2026-10-27T10:00:00.000Z',
    };
    const threadReply = {
      _id: 'reply-1',
      tmid: 'parent-1',
      msg: 'Reply to be deleted',
      ts: '2026-10-27T10:02:00.000Z',
    };

    useMessageStore.setState({
      messages: [parent],
      isThreadOpen: true,
      threadMainMessage: parent,
      threadMessages: [threadReply],
    });

    // Delete thread reply by id with parentId
    useMessageStore.getState().removeMessage('reply-1', 'parent-1');

    const state = useMessageStore.getState();
    assert.equal(
      state.threadMessages.length,
      0,
      'Deleted reply should be removed from threadMessages'
    );
    assert.equal(
      state.threadMainMessage.tcount,
      1,
      'threadMainMessage tcount should decrement'
    );
    const updatedParent = state.messages.find((m) => m._id === 'parent-1');
    assert.equal(
      updatedParent.tcount,
      1,
      'Parent in messages should decrement tcount'
    );
  });

  test('removeMessage closes active thread view when the parent message is deleted', () => {
    const parent = {
      _id: 'parent-1',
      msg: 'Parent msg to be deleted',
      ts: '2026-10-27T10:00:00.000Z',
    };

    useMessageStore.setState({
      messages: [parent],
      isThreadOpen: true,
      threadMainMessage: parent,
      threadMessages: [
        { _id: 'reply-1', tmid: 'parent-1', msg: 'Orphaned reply' },
      ],
    });

    useMessageStore.getState().removeMessage('parent-1');

    const state = useMessageStore.getState();
    assert.equal(
      state.messages.length,
      0,
      'Parent must be removed from messages'
    );
    assert.equal(
      state.isThreadOpen,
      false,
      'isThreadOpen must be closed when parent is deleted'
    );
    assert.equal(
      state.threadMainMessage,
      null,
      'threadMainMessage must be reset to null'
    );
    assert.equal(
      state.threadMessages.length,
      0,
      'threadMessages must be cleared'
    );
  });

  test('replaceMessage updates message across messages and threadMainMessage', () => {
    const parent = {
      _id: 'parent-1',
      msg: 'Original parent content',
      ts: '2026-10-27T10:00:00.000Z',
    };

    useMessageStore.setState({
      messages: [parent],
      isThreadOpen: true,
      threadMainMessage: parent,
      threadMessages: [],
    });

    const updatedParent = {
      ...parent,
      msg: 'Updated parent content via replaceMessage',
    };

    useMessageStore.getState().replaceMessage('parent-1', updatedParent);

    const state = useMessageStore.getState();
    assert.equal(
      state.messages[0].msg,
      'Updated parent content via replaceMessage'
    );
    assert.equal(
      state.threadMainMessage.msg,
      'Updated parent content via replaceMessage'
    );
  });
});
