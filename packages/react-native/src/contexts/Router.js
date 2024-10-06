import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * @typedef {function(string, any): void} NavigateFunction
 * @typedef {Object} ECRouterOptions
 * @property {string} name
 * @property {any} payload 
 * @property {NavigateFunction} navigate
 */

const ECRouterContext = createContext({ name: '', payload: null });

export const ECRouteProvider = ({defaultName = '', children}) => {
	const [name, setName] = useState(defaultName);
	const [payload, setPayload] = useState(undefined);

	const navigate = useCallback((name, payload) => {
		setName(name)
		setPayload(payload);
	}, [setName, setPayload]);

	const contextValue = useMemo(() => ({ name, payload, navigate }), [name, payload, navigate])
	return (
		<ECRouterContext.Provider value={contextValue}>
			{children}
		</ECRouterContext.Provider>
	)
};

export const ECRoute = ({name, children}) => {
	const { name: currentName } = useECRouter();
	if (name === currentName) {
		return children;
	}
	return null;
} 
/**
 * @returns {ECRouterOptions}
 */
export const useECRouter = () => {
	const routerOptions = useContext(ECRouterContext);
	return routerOptions;
}
