const getDraftKey = (roomId, threadId) =>
  threadId ? `ec_draft_${roomId}_${threadId}` : `ec_draft_${roomId}`;

export function getDraftMessage(roomId, threadId) {
  if (typeof localStorage !== 'undefined' && roomId) {
    return localStorage.getItem(getDraftKey(roomId, threadId));
  }
  return null;
}

export function saveDraftMessage(roomId, threadId, message) {
  if (typeof localStorage === 'undefined' || !roomId) {
    return;
  }
  if (message && message.trim().length) {
    localStorage.setItem(getDraftKey(roomId, threadId), message);
  } else {
    localStorage.removeItem(getDraftKey(roomId, threadId));
  }
}

export function deleteDraftMessage(roomId, threadId) {
  if (typeof localStorage !== 'undefined' && roomId) {
    localStorage.removeItem(getDraftKey(roomId, threadId));
  }
}
