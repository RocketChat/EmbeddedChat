import {
  FONT_STACKS,
  THEME_RADII,
  normalizeHex,
} from './generateThemeFromColor.js';
import { GeminiAdapter, OpenAIAdapter } from '@embeddedchat/ai-adapter';

export const THEME_PROVIDERS = {
  ollama: { label: 'Ollama (local)', model: 'gemma4' },
  openai: { label: 'OpenAI', model: 'gpt-4o', baseUrl: 'https://api.openai.com/v1' },
  gemini: {
    label: 'Google Gemini',
    model: 'gemini-2.0-flash',
    baseUrl: 'https://generativelanguage.googleapis.com',
  },
  fallback: { label: 'Deterministic fallback' },
};

const NAMED_COLORS = {
  red: '#ef4444', orange: '#f97316', amber: '#f59e0b', yellow: '#eab308',
  green: '#22c55e', teal: '#14b8a6', cyan: '#06b6d4', blue: '#3b82f6',
  indigo: '#6366f1', violet: '#8b5cf6', purple: '#a855f7', pink: '#ec4899',
  rose: '#f43f5e', slate: '#64748b', gray: '#6b7280', black: '#0f172a',
};

export const THEME_SUGGESTION_SCHEMA = {
  type: 'object',
  properties: {
    primaryHex: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
    accentHex: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
    radius: { enum: THEME_RADII },
    fontFamily: { enum: Object.values(FONT_STACKS) },
    mode: { enum: ['light', 'dark'] },
    messageView: { enum: ['flat', 'bubble'] },
    displayName: { enum: ['normal', 'colorize'] },
  },
  required: ['primaryHex'],
  additionalProperties: false,
};

const REFINEMENT_SUGGESTION_SCHEMA = {
  ...THEME_SUGGESTION_SCHEMA,
  required: [],
};

const findColors = (description) => {
  const hexes = description.match(/#(?:[a-f\d]{3}|[a-f\d]{6})\b/gi) ?? [];
  const names = description.toLowerCase().match(/[a-z]+/g)
    ?.map((word) => NAMED_COLORS[word]).filter(Boolean) ?? [];
  return [...hexes, ...names].map(normalizeHex).filter(Boolean);
};

const inferRadius = (description) => {
  const prompt = description.toLowerCase();
  if (/\b(pill|fully rounded|very rounded|circular)\b/.test(prompt)) return '1.5rem';
  if (/\b(rounded|round)\b/.test(prompt)) return '0.5rem';
  if (/\b(subtle|soft corners?|slightly rounded)\b/.test(prompt)) return '0.25rem';
  if (/\b(sharp|flat|square|squared|angular|no radius)\b/.test(prompt)) return '0rem';
  return undefined;
};

const inferFontFamily = (description) => {
  const prompt = description.toLowerCase();
  if (/\b(serif|editorial|traditional)\b/.test(prompt)) return FONT_STACKS.serif;
  if (/\b(mono|monospace|developer|code|technical)\b/.test(prompt)) return FONT_STACKS.mono;
  if (/\b(sans|minimal|modern|friendly|professional|corporate)\b/.test(prompt)) return FONT_STACKS.sans;
  return undefined;
};

const inferMode = (description) => {
  const prompt = description.toLowerCase();
  const requestedMode = prompt.match(
    /\b(?:switch|change|set|turn)\s+(?:it\s+)?to\s+(light|dark)\b/
  );
  if (requestedMode) return requestedMode[1];

  const namedThemeMode = prompt.match(/\b(light|dark)\s+(?:mode|theme)\b/);
  if (namedThemeMode) return namedThemeMode[1];
  if (/\b(dark|night)\b/.test(prompt)) return 'dark';
  if (/\b(light|bright|day)\b/.test(prompt)) return 'light';
  return undefined;
};

const inferMessageView = (description) => {
  const prompt = description.toLowerCase();
  if (/\b(bubble|bubbled)\b/.test(prompt)) return 'bubble';
  if (/\bflat\b/.test(prompt)) return 'flat';
  return undefined;
};

const inferDisplayName = (description) => {
  const prompt = description.toLowerCase();
  if (/\b(colorize|colorized|colourize|colourized)\b/.test(prompt)) {
    return 'colorize';
  }
  if (/\bnormal\b.*\b(display name|username)|\b(display name|username)\b.*\bnormal\b/.test(prompt)) {
    return 'normal';
  }
  return undefined;
};

const requestedRefinementFields = (description) => {
  const prompt = description.toLowerCase();
  const fields = new Set();
  const preservesPalette =
    /\b(keep|retain|preserve)\s+(?:the\s+)?(?:colou?rs?|palette|brand|primary|accent)\b/.test(
      prompt
    );

  if (
    findColors(description).length ||
    (!preservesPalette &&
      /\b(colou?r|palette|brand|primary|accent|hue|saturation|warmer|cooler|lighten|darken)\b/.test(
        prompt
      ))
  ) {
    fields.add('primaryHex');
    fields.add('accentHex');
  }
  if (
    inferRadius(description) ||
    /\b(radius|corner|corners)\b/.test(prompt)
  ) fields.add('radius');
  if (
    inferFontFamily(description) ||
    /\b(font|typeface|typography)\b/.test(prompt)
  ) fields.add('fontFamily');
  if (/\b(dark|light)\s+(mode|theme)\b|\bswitch\s+to\s+(dark|light)\b/.test(prompt)) {
    fields.add('mode');
  }
  if (/\b(message view|message type|bubble|flat)\b/.test(prompt)) {
    fields.add('messageView');
  }
  if (/\b(display name|username|colorize|colourize)\b/.test(prompt)) {
    fields.add('displayName');
  }
  return fields;
};

export const limitRefinementSuggestion = (suggestion, description) => {
  const allowedFields = requestedRefinementFields(description);
  const limitedSuggestion = Object.fromEntries(
    Object.entries(suggestion).filter(([key, value]) =>
      allowedFields.has(key) && value !== undefined
    )
  );

  // Direct style requests are commands, not creative suggestions. An adapter
  // may misread the surrounding conversation, so deterministic local parsing
  // always takes precedence for shape, typography, and mode.
  const requestedSuggestion = createLocalSuggestion(description, {
    preserveExisting: true,
  });
  ['radius', 'fontFamily', 'mode', 'messageView', 'displayName'].forEach((field) => {
    if (allowedFields.has(field) && requestedSuggestion[field]) {
      limitedSuggestion[field] = requestedSuggestion[field];
    }
  });

  return limitedSuggestion;
};

export const validateThemeSuggestion = (value, { allowPartial = false } = {}) => {
  if (!value || typeof value !== 'object') {
    throw new Error('Ollama returned an invalid theme response.');
  }
  const primaryHex = normalizeHex(value.primaryHex ?? value.primaryColor);
  const accentHex = normalizeHex(value.accentHex ?? value.accentColor);
  if (!primaryHex && !allowPartial) {
    throw new Error('Ollama did not return a valid primaryHex color.');
  }

  return {
    primaryHex: primaryHex ?? undefined,
    accentHex: accentHex ?? undefined,
    radius: THEME_RADII.includes(value.radius) ? value.radius : undefined,
    fontFamily: Object.values(FONT_STACKS).includes(value.fontFamily)
      ? value.fontFamily
      : undefined,
    mode: value.mode === 'dark' || value.mode === 'light' ? value.mode : undefined,
    messageView: ['flat', 'bubble'].includes(value.messageView)
      ? value.messageView
      : undefined,
    displayName: ['normal', 'colorize'].includes(value.displayName)
      ? value.displayName
      : undefined,
  };
};

export const createLocalSuggestion = (description, { preserveExisting = false } = {}) => {
  const colors = findColors(description);
  return {
    primaryHex: colors[0] ?? (preserveExisting ? undefined : '#2563eb'),
    accentHex: colors[1] ?? undefined,
    radius: inferRadius(description),
    fontFamily: inferFontFamily(description),
    mode: inferMode(description),
    messageView: inferMessageView(description),
    displayName: inferDisplayName(description),
  };
};

export const applyExplicitInitialIntent = (suggestion, description) => {
  const explicit = createLocalSuggestion(description);
  const colors = findColors(description);
  return {
    ...suggestion,
    ...(colors[0] ? { primaryHex: explicit.primaryHex } : {}),
    ...(colors[1] ? { accentHex: explicit.accentHex } : {}),
    ...(explicit.radius ? { radius: explicit.radius } : {}),
    ...(explicit.fontFamily ? { fontFamily: explicit.fontFamily } : {}),
    ...(explicit.mode ? { mode: explicit.mode } : {}),
    ...(explicit.messageView ? { messageView: explicit.messageView } : {}),
    ...(explicit.displayName ? { displayName: explicit.displayName } : {}),
  };
};

const getLocalOllamaUrl = (baseUrl) => {
  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error('Enter a valid local Ollama URL.');
  }
  const isLocalHost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (!isLocalHost) {
    throw new Error('Direct Ollama access is restricted to your local machine.');
  }
  return `${url.toString().replace(/\/$/, '')}/api/generate`;
};

const getPrompt = (description, context, preserveExisting) => `
You create EmbeddedChat theme suggestions for developers.
Return only JSON matching the supplied schema.
${preserveExisting
    ? 'This is a refinement: include only properties the latest request explicitly changes. Omit every unchanged property.'
    : 'Create a complete initial theme suggestion.'}

Existing instructions:\n${context || 'None'}

Latest request:\n${description}`;

const getAdapterPrompt = (description, context, preserveExisting) => `${getPrompt(
  description,
  context,
  preserveExisting
)}

JSON schema:
${JSON.stringify(
  preserveExisting ? REFINEMENT_SUGGESTION_SCHEMA : THEME_SUGGESTION_SCHEMA
)}`;

const parseResponseText = (text) => {
  const json = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  return JSON.parse(json);
};

const requestAdapterSuggestion = async ({
  provider,
  model,
  baseUrl,
  apiKey,
  description,
  context,
  preserveExisting,
}) => {
  if (!apiKey?.trim()) {
    throw new Error(`${THEME_PROVIDERS[provider].label} requires an API key.`);
  }

  const Adapter = provider === 'gemini' ? GeminiAdapter : OpenAIAdapter;
  const adapter = new Adapter({
    apiKey: apiKey.trim(),
    model,
    baseUrl,
    tasks: { composer: { temperature: 0, maxTokens: 300 } },
  });
  const response = await adapter.sendPrompt(
    {
      roomId: 'layout-editor',
      userId: 'theme-generator',
      history: [],
      // The adapter's generic composer task provides a deterministic,
      // short-form request profile. The prompt below still defines the
      // theme-specific JSON contract.
      metadata: { task: 'composer' },
    },
    getAdapterPrompt(description, context, preserveExisting)
  );

  const suggestion = validateThemeSuggestion(parseResponseText(response.text), {
    allowPartial: preserveExisting,
  });
  return {
    ...(preserveExisting
      ? limitRefinementSuggestion(suggestion, description)
      : applyExplicitInitialIntent(suggestion, description)),
    source: provider,
  };
};

export const requestThemeSuggestion = async ({
  description,
  context,
  provider = 'ollama',
  baseUrl,
  model,
  apiKey,
  preserveExisting = false,
  signal,
}) => {
  if (provider === 'fallback') {
    return {
      ...createLocalSuggestion(description, { preserveExisting }),
      source: 'fallback',
    };
  }

  if (provider !== 'ollama') {
    try {
      return await requestAdapterSuggestion({
        provider,
        model,
        baseUrl,
        apiKey,
        description,
        context,
        preserveExisting,
      });
    } catch (error) {
      throw new Error(error.message || 'The AI adapter could not generate a theme.');
    }
  }

  const ollamaUrl = getLocalOllamaUrl(baseUrl);
  let response;
  try {
    response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        model,
        prompt: getPrompt(description, context, preserveExisting),
        format: preserveExisting
          ? REFINEMENT_SUGGESTION_SCHEMA
          : THEME_SUGGESTION_SCHEMA,
        options: { temperature: 0 },
        stream: false,
      }),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not reach Ollama. Start it locally or use the fallback.');
  }

  if (!response.ok) {
    throw new Error(`Ollama request failed (${response.status}). Check the model name.`);
  }

  const result = await response.json();
  try {
    const suggestion = validateThemeSuggestion(parseResponseText(result.response), {
      allowPartial: preserveExisting,
    });
    return {
      ...(preserveExisting
        ? limitRefinementSuggestion(suggestion, description)
        : applyExplicitInitialIntent(suggestion, description)),
      source: 'ollama',
    };
  } catch {
    throw new Error('Ollama returned an invalid theme response. Try the request again.');
  }
};
