const inMemoryDrafts = new Map();

const getDraftKey = (roomId, threadId, userId, host) => {
  const scope = `${host || ''}_${userId || ''}`;
  return threadId
    ? `ec_draft_${scope}_${roomId}_${threadId}`
    : `ec_draft_${scope}_${roomId}`;
};

const getStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    // SecurityError / access denied in cross-origin iframes
  }
  return null;
};

export function getDraftMessage(roomId, threadId, userId, host) {
  if (!roomId) {
    return null;
  }
  const key = getDraftKey(roomId, threadId, userId, host);
  const storage = getStorage();
  if (storage) {
    try {
      const draft = storage.getItem(key);
      if (draft !== null) {
        return draft;
      }
    } catch (e) {
      // Storage access blocked or threw
    }
  }
  return inMemoryDrafts.get(key) || null;
}

export function saveDraftMessage(roomId, threadId, userId, host, message) {
  if (!roomId) {
    return;
  }
  const key = getDraftKey(roomId, threadId, userId, host);
  const hasText = message && message.trim().length > 0;

  if (hasText) {
    inMemoryDrafts.set(key, message);
    const storage = getStorage();
    if (storage) {
      try {
        storage.setItem(key, message);
      } catch (e) {
        // QuotaExceededError or restricted access; inMemoryDrafts preserves state
      }
    }
  } else {
    inMemoryDrafts.delete(key);
    const storage = getStorage();
    if (storage) {
      try {
        storage.removeItem(key);
      } catch (e) {
        // Ignore removal error
      }
    }
  }
}

export function deleteDraftMessage(roomId, threadId, userId, host) {
  if (!roomId) {
    return;
  }
  const key = getDraftKey(roomId, threadId, userId, host);
  inMemoryDrafts.delete(key);
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(key);
    } catch (e) {
      // Ignore removal error
    }
  }
}

export function clearInMemoryDrafts() {
  inMemoryDrafts.clear();
}
