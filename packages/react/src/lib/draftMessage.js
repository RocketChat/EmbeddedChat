const getDraftKey = (roomId, threadId, userId, host) => {
  const scope = `${host || ''}_${userId || ''}`;
  return threadId
    ? `ec_draft_${scope}_${roomId}_${threadId}`
    : `ec_draft_${scope}_${roomId}`;
};

export function getDraftMessage(roomId, threadId, userId, host) {
  if (typeof localStorage !== 'undefined' && roomId) {
    return localStorage.getItem(getDraftKey(roomId, threadId, userId, host));
  }
  return null;
}

export function saveDraftMessage(roomId, threadId, userId, host, message) {
  if (typeof localStorage === 'undefined' || !roomId) {
    return;
  }
  if (message && message.trim().length) {
    localStorage.setItem(getDraftKey(roomId, threadId, userId, host), message);
  } else {
    localStorage.removeItem(getDraftKey(roomId, threadId, userId, host));
  }
}

export function deleteDraftMessage(roomId, threadId, userId, host) {
  if (typeof localStorage !== 'undefined' && roomId) {
    localStorage.removeItem(getDraftKey(roomId, threadId, userId, host));
  }
}
