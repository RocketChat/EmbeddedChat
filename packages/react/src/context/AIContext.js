import { createContext, useContext } from 'react';

/**
 * AIContext — provides the active AIAdapter instance to any component
 * in the EmbeddedChat tree. Widget code never imports a concrete adapter.
 *
 * @example
 * import { AdapterFactory } from '@embeddedchat/ai-adapter';
 * import { AIAdapterProvider } from '@embeddedchat/react';
 *
 * const adapter = AdapterFactory.create({ provider: 'mock' });
 *
 * <AIAdapterProvider adapter={adapter}>
 *   <EmbeddedChat host="..." roomId="..." />
 * </AIAdapterProvider>
 */
const AIContext = createContext(null);

export const AIAdapterProvider = AIContext.Provider;

/**
 * Returns the active AIAdapter, or null if no provider is mounted.
 * @returns {import('@embeddedchat/ai-adapter').AIAdapter | null}
 */
export const useAIAdapter = () => useContext(AIContext);

export default AIContext;
