import test from 'node:test';
import assert from 'node:assert/strict';
import {
  serializeReactions,
  isSameUser,
  getReactorsList,
  getTotalReactionCount,
} from './reaction.js';

const mockReactions = {
  ':thumbsup:': {
    usernames: ['alice', 'bob'],
    names: ['Alice Smith', 'Bob Jones'],
  },
  ':heart:': {
    usernames: ['charlie'],
  },
};

test('serializeReactions properly transforms reactions object', () => {
  const result = serializeReactions(mockReactions);
  assert.equal(result.length, 2);
  assert.equal(result[0].name, ':thumbsup:');
  assert.equal(result[0].count, 2);
  assert.deepEqual(result[0].usernames, ['alice', 'bob']);
  assert.deepEqual(result[0].names, ['Alice Smith', 'Bob Jones']);

  assert.equal(result[1].name, ':heart:');
  assert.equal(result[1].count, 1);
  assert.deepEqual(result[1].usernames, ['charlie']);
  assert.deepEqual(result[1].names, []);
});

test('serializeReactions handles null or invalid input safely', () => {
  assert.deepEqual(serializeReactions(null), []);
  assert.deepEqual(serializeReactions(undefined), []);
  assert.deepEqual(serializeReactions('invalid'), []);
});

test('isSameUser checks if a user reacted', () => {
  const reaction = { usernames: ['alice', 'bob'] };
  assert.equal(isSameUser(reaction, 'alice'), true);
  assert.equal(isSameUser(reaction, 'bob'), true);
  assert.equal(isSameUser(reaction, 'eve'), false);
  assert.equal(isSameUser(null, 'alice'), false);
});

test('getReactorsList returns reactors for a specific emoji', () => {
  const reactors = getReactorsList(mockReactions, ':thumbsup:');
  assert.equal(reactors.length, 2);
  assert.deepEqual(reactors[0], {
    username: 'alice',
    name: 'Alice Smith',
    emoji: ':thumbsup:',
  });
  assert.deepEqual(reactors[1], {
    username: 'bob',
    name: 'Bob Jones',
    emoji: ':thumbsup:',
  });
});

test('getReactorsList fallbacks to username when name is not provided', () => {
  const reactors = getReactorsList(mockReactions, ':heart:');
  assert.equal(reactors.length, 1);
  assert.deepEqual(reactors[0], {
    username: 'charlie',
    name: 'charlie',
    emoji: ':heart:',
  });
});

test('getReactorsList aggregates all emojis when target is null or all', () => {
  const allReactors = getReactorsList(mockReactions);
  assert.equal(allReactors.length, 3);

  const allReactorsExplicit = getReactorsList(mockReactions, 'all');
  assert.equal(allReactorsExplicit.length, 3);
});

test('getTotalReactionCount calculates correct total', () => {
  assert.equal(getTotalReactionCount(mockReactions), 3);
  assert.equal(getTotalReactionCount(null), 0);
  assert.equal(getTotalReactionCount({}), 0);
});
