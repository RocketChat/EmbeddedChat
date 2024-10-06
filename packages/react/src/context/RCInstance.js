import { createContext, useContext } from 'react';

const RCContext = createContext();

export const RCInstanceProvider = RCContext.Provider;

/**
 * @typedef {Object} ECOptions
 * @property {boolean} enableThreads
 * @property {string} authFlow
 * @property {string} width
 * @property {string} height
 * @property {string} host
 * @property {string} roomId
 * @property {string} channelName
 * @property {boolean} showRoles
 * @property {boolean} showAvatar
 * @property {boolean} hideHeader
 * @property {boolean} anonymousMode
 *
 * @typedef {Object} RCContext
 * @property {import('@embeddedchat/api').EmbeddedChatApi} RCInstance
 * @property {ECOptions} ECOptions
 * @returns {RCContext}
 */
export const useRCContext = () => useContext(RCContext);

export default RCContext;
