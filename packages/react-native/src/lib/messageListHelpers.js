import cloneArray from './cloneArray';

// Caution: Not a pure function
export const insertMessage = (messages, message) => {
  const idx = messages.findIndex((m) => new Date(m.ts) < new Date(message.ts));
  if (idx === -1) {
    // all the messages are newer than the current message, insert at last
    messages.push(message);
  } else if (idx === 0) {
    // the message is the latest one, insert at front
    messages.unshift(message);
  } else {
    messages.splice(idx, 0, message);
  }
  return messages;
};

/**
 * Inserts the message or updates if already present in the list. Makes a copy of the messages[].
 * @param {*} messages
 * @param {*} message
 * @returns newMessageList
 */
export const upsertMessage = (messages, message) => {
  const newMessages = cloneArray(messages);
  const idx = newMessages.findIndex((m) => m._id === message._id);
  if (idx === -1) {
    // the message is new, insert it.
    return insertMessage(newMessages, message);
  }
  newMessages[idx] = message;
  if (newMessages[idx].tlm && typeof newMessages[idx].tlm?.$date === 'number') {
    newMessages[idx].tlm = new Date(newMessages[idx].tlm?.$date).toISOString();
  }
  return newMessages;
};
