import test from 'node:test';
import assert from 'node:assert/strict';
import {
  serializeReactions,
  getReactorsList,
  getTotalReactionCount,
} from '../../lib/reaction.js';

const mockMessageWithReactions = {
  _id: 'msg123',
  msg: 'Great job everyone!',
  reactions: {
    ':thumbsup:': {
      usernames: ['alice', 'bob'],
      names: ['Alice Smith', 'Bob Jones'],
    },
    ':heart:': {
      usernames: ['alice', 'charlie'],
      names: ['Alice Smith'],
    },
    ':rocket:': {
      usernames: ['david'],
    },
  },
};

test('ReactionDetailsModal data: calculates correct tabs and counts', () => {
  const serialized = serializeReactions(mockMessageWithReactions.reactions);
  assert.equal(serialized.length, 3);

  const totalCount = getTotalReactionCount(mockMessageWithReactions.reactions);
  assert.equal(totalCount, 5);

  assert.equal(serialized[0].name, ':thumbsup:');
  assert.equal(serialized[0].count, 2);

  assert.equal(serialized[1].name, ':heart:');
  assert.equal(serialized[1].count, 2);

  assert.equal(serialized[2].name, ':rocket:');
  assert.equal(serialized[2].count, 1);
});

test('ReactionDetailsModal data: getReactorsList filters by specific emoji', () => {
  const thumbsUpReactors = getReactorsList(
    mockMessageWithReactions.reactions,
    ':thumbsup:'
  );
  assert.equal(thumbsUpReactors.length, 2);
  assert.equal(thumbsUpReactors[0].username, 'alice');
  assert.equal(thumbsUpReactors[0].name, 'Alice Smith');
  assert.equal(thumbsUpReactors[0].emoji, ':thumbsup:');

  assert.equal(thumbsUpReactors[1].username, 'bob');
  assert.equal(thumbsUpReactors[1].name, 'Bob Jones');
});

test('ReactionDetailsModal data: getReactorsList falls back to username when name is missing', () => {
  const heartReactors = getReactorsList(
    mockMessageWithReactions.reactions,
    ':heart:'
  );
  assert.equal(heartReactors.length, 2);
  assert.equal(heartReactors[0].name, 'Alice Smith');
  assert.equal(heartReactors[1].username, 'charlie');
  assert.equal(heartReactors[1].name, 'charlie'); // fallback to username
});

test('ReactionDetailsModal data: All tab aggregates reactors across all emojis', () => {
  const allReactors = getReactorsList(
    mockMessageWithReactions.reactions,
    'all'
  );
  assert.equal(allReactors.length, 5);

  const emojis = allReactors.map((r) => r.emoji);
  assert.deepEqual(emojis, [
    ':thumbsup:',
    ':thumbsup:',
    ':heart:',
    ':heart:',
    ':rocket:',
  ]);
});

test('ReactionDetailsModal data: handles message without reactions gracefully', () => {
  const emptyMsg = { _id: 'empty', msg: 'No reactions here' };
  const serialized = serializeReactions(emptyMsg.reactions);
  assert.deepEqual(serialized, []);

  const totalCount = getTotalReactionCount(emptyMsg.reactions);
  assert.equal(totalCount, 0);

  const reactors = getReactorsList(emptyMsg.reactions, 'all');
  assert.deepEqual(reactors, []);
});

test('ReactionDetailsModal data: identifies authenticated user in reactors list', () => {
  const authUsername = 'alice';
  const reactors = getReactorsList(
    mockMessageWithReactions.reactions,
    ':thumbsup:'
  );
  const isAliceFirst = reactors[0].username === authUsername;
  const isBobFirst = reactors[1].username === authUsername;
  assert.equal(isAliceFirst, true);
  assert.equal(isBobFirst, false);
});
