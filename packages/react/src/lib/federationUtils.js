/**
 * Returns true if the username looks like a Matrix user ID (@localpart:homeserver.tld).
 * @param {string} username
 * @returns {boolean}
 */
export const isMatrixUser = (username) => {
  if (!username) return false;
  return /^@[^:]+:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(username);
};

/**
 * Parses a Matrix user ID into localpart and homeserver.
 * @param {string} matrixId  e.g. "@alice:matrix.org"
 * @returns {{ localpart: string, homeserver: string } | null}
 */
export const parseMatrixUserId = (matrixId) => {
  if (!isMatrixUser(matrixId)) return null;
  const withoutAt = matrixId.slice(1);
  const colonIdx = withoutAt.indexOf(':');
  return {
    localpart: withoutAt.slice(0, colonIdx),
    homeserver: withoutAt.slice(colonIdx + 1),
  };
};

/**
 * Returns a display-friendly label, truncating long homeservers.
 * @param {string} matrixId
 * @returns {string}
 */
export const getMatrixDisplayLabel = (matrixId) => {
  const parsed = parseMatrixUserId(matrixId);
  if (!parsed) return matrixId;
  const { localpart, homeserver } = parsed;
  const shortHost =
    homeserver.length > 20 ? homeserver.slice(0, 18) + '…' : homeserver;
  return `@${localpart}:${shortHost}`;
};

/**
 * Returns 1-2 char initials for avatar fallback.
 * @param {string} matrixId
 * @returns {string}
 */
export const getMatrixInitials = (matrixId) => {
  const parsed = parseMatrixUserId(matrixId);
  if (!parsed) return '?';
  return parsed.localpart.slice(0, 2).toUpperCase();
};

/**
 * Generates a deterministic background color from a string.
 * @param {string} str
 * @returns {string}
 */
export const getAvatarColor = (str) => {
  const COLORS = [
    '#e57373', '#f06292', '#ba68c8', '#9575cd',
    '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1',
    '#4db6ac', '#81c784', '#aed581', '#ffd54f',
    '#ffb74d', '#ff8a65', '#a1887f', '#90a4ae',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};
