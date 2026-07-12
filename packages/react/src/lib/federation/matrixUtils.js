/**
 * POC: Matrix Federation Identification Utilities
 * This utility safely parses and normalizes standard Rocket.Chat user/room IDs 
 * versus complex Matrix-federated identifiers.
 */

/**
 * Standardizes displaying a username, detecting if it has a Matrix homeserver attached.
 * @param {string} username - Original username from the backend payload
 * @returns {Object} - Parsed identity parts
 */
export const parseFederatedIdentity = (username) => {
  if (!username) return { name: 'Unknown', isFederated: false, server: null };

  // Matrix pattern: @username:homeserver.org
  const matrixRegex = /^@([^:]+):(.+)$/;
  const match = username.match(matrixRegex);

  if (match) {
    return {
      name: match[1],
      isFederated: true,
      server: match[2],
      original: username
    };
  }

  return {
    name: username,
    isFederated: false,
    server: null,
    original: username
  };
};

/**
 * Decorates a message object with normalized federated IDs for the UI to consume securely.
 * @param {Object} message - Raw message payload
 * @returns {Object} - Decorated message
 */
export const decorateFederatedMessage = (message) => {
  if (!message || !message.u) return message;
  
  const parsedIdentity = parseFederatedIdentity(message.u.username);
  
  return {
    ...message,
    federationMeta: {
      ...parsedIdentity
    }
  };
};
