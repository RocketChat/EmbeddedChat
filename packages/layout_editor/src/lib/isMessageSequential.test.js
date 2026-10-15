import test from 'node:test';
import assert from 'node:assert/strict';
import isMessageSequential from './isMessageSequential.js';

test('does not group when there is no previous message', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00' },
      undefined,
      300
    ),
    false
  );
});

test('groups consecutive messages from the same user inside the grouping range', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:02:00' },
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00' },
      300
    ),
    true
  );
});

test('does not group messages written by different users', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-2' }, ts: '2026-09-23T10:02:00' },
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00' },
      300
    ),
    false
  );
});

test('does not group once the gap is wider than the grouping range', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:10:00' },
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00' },
      300
    ),
    false
  );
});

test('does not group system messages', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:02:00', t: 'uj' },
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00' },
      300
    ),
    false
  );
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:02:00' },
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00', t: 'uj' },
      300
    ),
    false
  );
});

test('does not group a message that is explicitly marked as not groupable', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:02:00', groupable: false },
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00' },
      300
    ),
    false
  );
});

test('does not group messages sent under different aliases', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:02:00', alias: 'bot' },
      { u: { _id: 'user-1' }, ts: '2026-09-23T10:00:00' },
      300
    ),
    false
  );
});

test('does not group across a day boundary even inside the grouping range', () => {
  assert.equal(
    isMessageSequential(
      { u: { _id: 'user-1' }, ts: '2026-09-24T00:01:00' },
      { u: { _id: 'user-1' }, ts: '2026-09-23T23:59:00' },
      300
    ),
    false
  );
});
