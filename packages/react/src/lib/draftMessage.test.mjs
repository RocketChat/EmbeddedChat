import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDraftMessage,
  saveDraftMessage,
  deleteDraftMessage,
  clearInMemoryDrafts,
} from './draftMessage.js';

test('draftMessage - basic save, get, and delete with mocked storage', async (t) => {
  const store = new Map();
  global.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
    },
  };

  t.afterEach(() => {
    store.clear();
    clearInMemoryDrafts();
  });

  saveDraftMessage('room1', undefined, 'user1', 'host1', 'Hello world');
  assert.equal(
    getDraftMessage('room1', undefined, 'user1', 'host1'),
    'Hello world'
  );

  // Verify deletion
  deleteDraftMessage('room1', undefined, 'user1', 'host1');
  assert.equal(getDraftMessage('room1', undefined, 'user1', 'host1'), null);
});

test('draftMessage - scopes drafts across rooms, threads, users, and hosts', async (t) => {
  const store = new Map();
  global.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
    },
  };

  t.afterEach(() => {
    store.clear();
    clearInMemoryDrafts();
  });

  saveDraftMessage('roomA', undefined, 'user1', 'host1', 'Draft in room A');
  saveDraftMessage('roomB', undefined, 'user1', 'host1', 'Draft in room B');
  saveDraftMessage('roomA', 'thread1', 'user1', 'host1', 'Draft in thread 1');
  saveDraftMessage('roomA', undefined, 'user2', 'host1', 'User 2 draft');
  saveDraftMessage('roomA', undefined, 'user1', 'host2', 'Host 2 draft');

  assert.equal(
    getDraftMessage('roomA', undefined, 'user1', 'host1'),
    'Draft in room A'
  );
  assert.equal(
    getDraftMessage('roomB', undefined, 'user1', 'host1'),
    'Draft in room B'
  );
  assert.equal(
    getDraftMessage('roomA', 'thread1', 'user1', 'host1'),
    'Draft in thread 1'
  );
  assert.equal(
    getDraftMessage('roomA', undefined, 'user2', 'host1'),
    'User 2 draft'
  );
  assert.equal(
    getDraftMessage('roomA', undefined, 'user1', 'host2'),
    'Host 2 draft'
  );
});

test('draftMessage - removes draft when saving empty or whitespace-only message', async (t) => {
  const store = new Map();
  global.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
    },
  };

  t.afterEach(() => {
    store.clear();
    clearInMemoryDrafts();
  });

  saveDraftMessage('room1', undefined, 'user1', 'host1', 'Initial draft');
  assert.equal(
    getDraftMessage('room1', undefined, 'user1', 'host1'),
    'Initial draft'
  );

  // Overwrite with empty string
  saveDraftMessage('room1', undefined, 'user1', 'host1', '');
  assert.equal(getDraftMessage('room1', undefined, 'user1', 'host1'), null);

  // Overwrite with whitespace
  saveDraftMessage('room1', undefined, 'user1', 'host1', 'Another draft');
  saveDraftMessage('room1', undefined, 'user1', 'host1', '    ');
  assert.equal(getDraftMessage('room1', undefined, 'user1', 'host1'), null);
});

test('draftMessage - safely handles missing or falsy roomId', async () => {
  assert.equal(getDraftMessage('', undefined, 'user1', 'host1'), null);
  assert.equal(getDraftMessage(null, undefined, 'user1', 'host1'), null);

  // Does not throw
  saveDraftMessage('', undefined, 'user1', 'host1', 'test');
  deleteDraftMessage('', undefined, 'user1', 'host1');
});

test('draftMessage - fallback to in-memory store when localStorage throws SecurityError in iframe', async (t) => {
  // Simulate sandboxed iframe where localStorage access throws SecurityError
  Object.defineProperty(global, 'window', {
    value: {
      get localStorage() {
        throw new Error(
          'SecurityError: Failed to read localStorage: Access is denied for this document.'
        );
      },
    },
    writable: true,
    configurable: true,
  });

  t.afterEach(() => {
    clearInMemoryDrafts();
  });

  // Saving should not throw
  assert.doesNotThrow(() => {
    saveDraftMessage(
      'room-iframe',
      undefined,
      'user1',
      'host1',
      'Iframe draft message'
    );
  });

  // Retrieving should not throw and should return the in-memory fallback draft
  assert.equal(
    getDraftMessage('room-iframe', undefined, 'user1', 'host1'),
    'Iframe draft message'
  );

  // Deleting should not throw and should clear in-memory draft
  assert.doesNotThrow(() => {
    deleteDraftMessage('room-iframe', undefined, 'user1', 'host1');
  });
  assert.equal(
    getDraftMessage('room-iframe', undefined, 'user1', 'host1'),
    null
  );
});

test('draftMessage - fallback to in-memory store when setItem throws QuotaExceededError', async (t) => {
  global.window = {
    localStorage: {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError: DOMException quota exceeded');
      },
      removeItem: () => {},
    },
  };

  t.afterEach(() => {
    clearInMemoryDrafts();
  });

  // Saving should not throw despite QuotaExceededError
  assert.doesNotThrow(() => {
    saveDraftMessage(
      'room-quota',
      undefined,
      'user1',
      'host1',
      'Saved despite quota'
    );
  });

  // In-memory fallback preserves the draft for this session
  assert.equal(
    getDraftMessage('room-quota', undefined, 'user1', 'host1'),
    'Saved despite quota'
  );
});

test('draftMessage - handles headless / SSR environment without window', async (t) => {
  delete global.window;

  t.afterEach(() => {
    clearInMemoryDrafts();
  });

  assert.doesNotThrow(() => {
    saveDraftMessage('room-ssr', undefined, 'user1', 'host1', 'SSR draft');
  });
  assert.equal(
    getDraftMessage('room-ssr', undefined, 'user1', 'host1'),
    'SSR draft'
  );
});
