export const getDraftKey = (roomId, threadId, userId, host) => {
  const scope = `${host || ''}_${userId || ''}`;
  return threadId
    ? `ec_draft_${scope}_${roomId}_${threadId}`
    : `ec_draft_${scope}_${roomId}`;
};

export function getDraftMessage(roomId, threadId, userId, host) {
  if (typeof localStorage === 'undefined' || !roomId) {
    return null;
  }
  try {
    return localStorage.getItem(getDraftKey(roomId, threadId, userId, host));
  } catch (e) {
    return null;
  }
}

export function saveDraftMessage(roomId, threadId, userId, host, message) {
  if (typeof localStorage === 'undefined' || !roomId) {
    return;
  }
  try {
    const key = getDraftKey(roomId, threadId, userId, host);
    if (message && message.trim().length) {
      localStorage.setItem(key, message);
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    // ignore quota or storage access errors
  }
}

export function deleteDraftMessage(roomId, threadId, userId, host) {
  if (typeof localStorage === 'undefined' || !roomId) {
    return;
  }
  try {
    localStorage.removeItem(getDraftKey(roomId, threadId, userId, host));
  } catch (e) {
    // ignore errors
  }
}
