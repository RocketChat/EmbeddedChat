import React, { createContext, useContext } from "react";

export const MessageContext = createContext();

export const MessageContextProvider = ({children, value}) => (
	<MessageContext.Provider value={value}>
		{children}
	</MessageContext.Provider>
);

/**
 * @typedef {Object} MessageContextValue
 * @property {any} message
 * @returns {MessageContextValue}
 */
export const useMessageContext = () => {
	const messageContext = useContext(MessageContext);
	return messageContext;
}
