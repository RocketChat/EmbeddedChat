import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDraftKey,
  getDraftMessage,
  saveDraftMessage,
  deleteDraftMessage,
} from './draftMessage.js';

// Setup mock localStorage in Node test environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] ?? null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new MockLocalStorage();

test('getDraftKey constructs room draft keys properly', () => {
  assert.equal(
    getDraftKey('room123', null, 'userA', 'https://chat.example.com'),
    'ec_draft_https://chat.example.com_userA_room123'
  );

  assert.equal(
    getDraftKey('room123', 'thread456', 'userA', 'https://chat.example.com'),
    'ec_draft_https://chat.example.com_userA_room123_thread456'
  );

  assert.equal(getDraftKey('GENERAL', null, null, null), 'ec_draft___GENERAL');
});

test('saveDraftMessage saves non-empty text to localStorage', () => {
  globalThis.localStorage.clear();
  saveDraftMessage(
    'room123',
    null,
    'userA',
    'https://chat.example.com',
    'Hello world'
  );

  assert.equal(
    getDraftMessage('room123', null, 'userA', 'https://chat.example.com'),
    'Hello world'
  );
});

test('saveDraftMessage removes key when message is empty or whitespace only', () => {
  globalThis.localStorage.clear();
  saveDraftMessage(
    'room123',
    null,
    'userA',
    'https://chat.example.com',
    'Initial draft'
  );
  assert.equal(
    getDraftMessage('room123', null, 'userA', 'https://chat.example.com'),
    'Initial draft'
  );

  saveDraftMessage('room123', null, 'userA', 'https://chat.example.com', '   ');
  assert.equal(
    getDraftMessage('room123', null, 'userA', 'https://chat.example.com'),
    null
  );
});

test('saveDraftMessage and getDraftMessage separate thread drafts from room drafts', () => {
  globalThis.localStorage.clear();
  saveDraftMessage(
    'room123',
    null,
    'userA',
    'https://chat.example.com',
    'Room draft'
  );
  saveDraftMessage(
    'room123',
    'thread1',
    'userA',
    'https://chat.example.com',
    'Thread draft'
  );

  assert.equal(
    getDraftMessage('room123', null, 'userA', 'https://chat.example.com'),
    'Room draft'
  );
  assert.equal(
    getDraftMessage('room123', 'thread1', 'userA', 'https://chat.example.com'),
    'Thread draft'
  );
});

test('deleteDraftMessage deletes saved draft from localStorage', () => {
  globalThis.localStorage.clear();
  saveDraftMessage(
    'room123',
    null,
    'userA',
    'https://chat.example.com',
    'Some draft'
  );
  deleteDraftMessage('room123', null, 'userA', 'https://chat.example.com');

  assert.equal(
    getDraftMessage('room123', null, 'userA', 'https://chat.example.com'),
    null
  );
});

test('getDraftMessage returns null when roomId is missing', () => {
  assert.equal(
    getDraftMessage('', null, 'userA', 'https://chat.example.com'),
    null
  );
});
