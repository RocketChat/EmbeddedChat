import type { AIAdapter, AdapterFactoryConfig, ProviderKey } from './types';
import { MockAIAdapter } from './adapters/MockAIAdapter';
import { OpenAIAdapter } from './adapters/OpenAIAdapter';
import { RocketChatAIAdapter } from './adapters/RocketChatAIAdapter';

type AdapterConstructor = new (...args: unknown[]) => AIAdapter;

const registry = new Map<string, AdapterConstructor>();

/**
 * AdapterFactory — the single switch that controls which AI provider is active.
 *
 * Usage:
 * ```ts
 * const adapter = AdapterFactory.create({ provider: 'mock' });
 * const adapter = AdapterFactory.create({ provider: 'openai', openaiApiKey: 'sk-...' });
 * ```
 *
 * To add a custom provider:
 * ```ts
 * AdapterFactory.register('my-llm', MyLLMAdapter);
 * const adapter = AdapterFactory.create({ provider: 'my-llm' as ProviderKey });
 * ```
 */
export class AdapterFactory {
  /**
   * Register a custom adapter under a string key.
   * Call this before `create()` when using a non-built-in provider.
   */
  static register(key: string, ctor: AdapterConstructor): void {
    registry.set(key, ctor);
  }

  /**
   * Create an adapter instance from config.
   * Falls back to MockAIAdapter if the requested provider is unavailable
   * (e.g. missing API key) to ensure the widget always works.
   */
  static create(config: AdapterFactoryConfig): AIAdapter {
    try {
      return AdapterFactory.build(config);
    } catch (err) {
      console.warn(
        `[AdapterFactory] Failed to create "${config.provider}" adapter — falling back to Mock.\n`,
        (err as Error).message
      );
      return new MockAIAdapter();
    }
  }

  /**
   * Returns the list of registered provider keys (built-in + custom).
   */
  static registeredProviders(): string[] {
    return ['mock', 'openai', 'rocketchat', ...registry.keys()];
  }

  private static build(config: AdapterFactoryConfig): AIAdapter {
    const key: string = config.provider;

    if (registry.has(key)) {
      const Ctor = registry.get(key)!;
      return new Ctor();
    }

    switch (key as ProviderKey) {
      case 'mock':
        return new MockAIAdapter();

      case 'openai':
        return new OpenAIAdapter(config.openaiApiKey);

      case 'rocketchat':
        return new RocketChatAIAdapter(config.rocketchatHost);

      default: {
        const exhaustive: never = key as never;
        throw new Error(`[AdapterFactory] Unknown provider: "${String(exhaustive)}"`);
      }
    }
  }
}
