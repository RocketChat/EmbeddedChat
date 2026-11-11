// Browser/Node-safe JSON contract. No React, providers, or runtime code generation.
export const GENERATED_UI_CONFIGURATION_VERSION = 1;
export const GENERATED_UI_SURFACES = ['message', 'contextualBar', 'modal'];
export const GENERATED_UI_COMPONENT_TYPES = [
  'form',
  'profile',
  'gallery',
  'cta',
  'info',
];
export const GENERATED_UI_PLACEMENTS = ['composer', 'messageToolbox'];
export const MAX_GENERATED_UI_BYTES = 256 * 1024;

const string = { type: 'string' };
const object = (properties, required = Object.keys(properties)) => ({
  type: 'object',
  properties,
  required,
  additionalProperties: false,
});
const array = (items) => ({ type: 'array', items });
const literal = (value) => ({ type: 'string', const: value });
const nullable = (schema) => ({ anyOf: [{ type: 'null' }, schema] });
const text = object({
  type: { type: 'string', enum: ['plain_text', 'mrkdwn'] },
  text: string,
});
const plainText = object({ type: literal('plain_text'), text: string });
const image = object({
  type: literal('image'),
  imageUrl: string,
  altText: string,
});
const button = object({
  type: literal('button'),
  text: plainText,
  actionId: string,
  value: string,
});
const input = object({
  type: literal('plain_text_input'),
  actionId: string,
  placeholder: nullable(plainText),
});

const blockSchema = (runtime = false) => {
  const inputElement = runtime
    ? object(
        {
          ...input.properties,
          initialValue: string,
          multiline: { type: 'boolean' },
        },
        input.required
      )
    : input;
  const blocks = [
    object({ type: literal('divider') }),
    image,
    object({
      type: literal('section'),
      text,
      accessory: nullable({ anyOf: [button, image] }),
    }),
    object({ type: literal('actions'), elements: array(button) }),
    object({ type: literal('input'), element: inputElement, label: plainText }),
    object({
      type: literal('context'),
      elements: array({ anyOf: [text, image] }),
    }),
  ];
  return {
    anyOf: runtime
      ? blocks.map((block) =>
          object({ ...block.properties, blockId: string }, block.required)
        )
      : blocks,
  };
};

// Provider schemas require every property for structured-output APIs. Runtime
// configurations additionally accept optional input defaults and block IDs.
export const UI_KIT_JSON_SCHEMA = object({
  componentType: { type: 'string', enum: GENERATED_UI_COMPONENT_TYPES },
  blocks: array(blockSchema()),
});
export const GENERATED_UI_CONFIGURATION_SCHEMA = object(
  {
    version: { type: 'number', const: GENERATED_UI_CONFIGURATION_VERSION },
    id: string,
    title: string,
    blocks: array(blockSchema(true)),
    surface: { type: 'string', enum: GENERATED_UI_SURFACES },
    componentType: { type: 'string', enum: GENERATED_UI_COMPONENT_TYPES },
    placements: array({ type: 'string', enum: GENERATED_UI_PLACEMENTS }),
  },
  ['version', 'id', 'blocks', 'surface', 'componentType', 'placements']
);

const isRecord = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

// Interpret the vocabulary above instead of compiling with unsafe-eval in hosts.
const validateSchema = (schema, value, path = '$') => {
  if (schema.anyOf) {
    const variants = schema.anyOf.filter(
      (option) =>
        !option.properties?.type?.const ||
        option.properties.type.const === value?.type
    );
    const results = (variants.length ? variants : schema.anyOf).map((option) =>
      validateSchema(option, value, path)
    );
    return results.some((errors) => errors.length === 0)
      ? []
      : results.reduce((best, errors) =>
          errors.length < best.length ? errors : best
        );
  }
  const matches =
    schema.type === 'null'
      ? value === null
      : schema.type === 'array'
      ? Array.isArray(value)
      : schema.type === 'object'
      ? isRecord(value)
      : typeof value === schema.type;
  if (!matches) return [`${path} must be ${schema.type}.`];
  if ('const' in schema && value !== schema.const)
    return [`${path} must be ${JSON.stringify(schema.const)}.`];
  if (schema.enum && !schema.enum.includes(value))
    return [`${path} has an unsupported value.`];
  if (schema.type === 'array')
    return value.flatMap((item, index) =>
      validateSchema(schema.items, item, `${path}[${index}]`)
    );
  if (schema.type !== 'object') return [];
  return [
    ...schema.required
      .filter((key) => !Object.hasOwn(value, key))
      .map((key) => `${path}.${key} is required.`),
    ...Object.keys(value).flatMap((key) =>
      Object.hasOwn(schema.properties, key)
        ? validateSchema(schema.properties[key], value[key], `${path}.${key}`)
        : [`${path}.${key} is not supported.`]
    ),
  ];
};

const validateJson = (value) => {
  const seen = new Set();
  let budget = MAX_GENERATED_UI_BYTES;
  const walk = (entry, depth) => {
    budget -= 1;
    if (depth > 20 || budget < 0)
      throw new Error('Configuration exceeds the size or nesting limit.');
    if (entry === null || typeof entry === 'boolean') return;
    if (typeof entry === 'string') {
      budget -= entry.length;
      return;
    }
    if (typeof entry === 'number' && Number.isFinite(entry)) return;
    if (typeof entry !== 'object' || seen.has(entry))
      throw new Error('Configuration must contain only acyclic JSON data.');
    if (Array.isArray(entry)) {
      const keys = Object.keys(entry);
      if (
        keys.length !== entry.length ||
        keys.some((key, index) => key !== String(index))
      )
        throw new Error(
          'Configuration arrays must not contain holes or extra properties.'
        );
    }
    if (
      !Array.isArray(entry) &&
      ![Object.prototype, null].includes(Object.getPrototypeOf(entry))
    )
      throw new Error('Configuration must contain only plain JSON objects.');
    seen.add(entry);
    for (const [key, child] of Object.entries(entry)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key))
        throw new Error('Configuration contains an unsafe property name.');
      budget -= key.length;
      walk(child, depth + 1);
    }
    seen.delete(entry);
  };
  try {
    walk(value, 0);
    if (
      new TextEncoder().encode(JSON.stringify(value)).length >
      MAX_GENERATED_UI_BYTES
    )
      throw new Error('Configuration exceeds 256 KiB.');
    return [];
  } catch (error) {
    return [error.message];
  }
};

const validateBlocks = (blocks) => {
  const ids = new Set();
  const errors = [];
  if (blocks.length > 100)
    errors.push('A configuration can contain at most 100 blocks.');
  blocks.forEach((block, index) => {
    [block, block.element, block.accessory, ...(block.elements || [])]
      .filter(Boolean)
      .forEach((element) => {
        if ('actionId' in element) {
          const id = element.actionId;
          if (
            !id.trim() ||
            ['__proto__', 'constructor', 'prototype'].includes(id) ||
            ids.has(id)
          )
            errors.push(
              `blocks[${index}] has an empty, unsafe, or duplicate actionId.`
            );
          ids.add(id);
        }
        if ('imageUrl' in element) {
          try {
            const url = new URL(element.imageUrl);
            if (
              !['https:', 'http:'].includes(url.protocol) ||
              url.username ||
              url.password
            )
              throw new Error();
          } catch {
            errors.push(
              `blocks[${index}].imageUrl must be an HTTP(S) URL without credentials.`
            );
          }
        }
      });
  });
  return errors;
};

export const validateGeneratedUiConfiguration = (value) => {
  let errors = validateJson(value);
  if (!errors.length)
    errors = validateSchema(GENERATED_UI_CONFIGURATION_SCHEMA, value);
  if (!errors.length) {
    errors = validateBlocks(value.blocks);
    if (!value.id.trim() || value.id !== value.id.trim())
      errors.push('id must be nonempty and have no surrounding whitespace.');
    if (
      !value.placements.length ||
      new Set(value.placements).size !== value.placements.length
    )
      errors.push('placements must be nonempty and unique.');
  }
  return { valid: errors.length === 0, errors };
};

export const validateGeneratedUiBlocks = (value) => {
  let errors = validateJson(value);
  if (!errors.length) errors = validateSchema(UI_KIT_JSON_SCHEMA, value);
  if (!errors.length) errors = validateBlocks(value.blocks);
  return { valid: errors.length === 0, errors };
};

export const isGeneratedUiConfiguration = (value) =>
  validateGeneratedUiConfiguration(value).valid;
export const createGeneratedUiConfiguration = ({
  id = 'generated-ui',
  title = 'Generated UI',
  blocks = [],
  surface = 'message',
  componentType = 'info',
  placements = ['composer'],
} = {}) => {
  const configuration = {
    version: GENERATED_UI_CONFIGURATION_VERSION,
    id,
    title,
    blocks,
    surface,
    componentType,
    placements,
  };
  const { errors } = validateGeneratedUiConfiguration(configuration);
  if (errors.length)
    throw new Error(`Invalid generated UI: ${errors.join(' ')}`);
  return configuration;
};

export const parseGeneratedUiConfigurations = (value) => {
  if (value == null) return { configurations: [], errors: [] };
  const candidates = Array.isArray(value) ? value : [value];
  if (candidates.length > 20)
    return {
      configurations: [],
      errors: ['At most 20 generated UI configurations are supported.'],
    };
  const errors = [],
    ids = new Set(),
    duplicates = new Set();
  const configurations = candidates.filter((configuration, index) => {
    const result = validateGeneratedUiConfiguration(configuration);
    if (!result.valid) {
      errors.push(...result.errors.map((error) => `[${index}] ${error}`));
      return false;
    }
    if (ids.has(configuration.id)) {
      duplicates.add(configuration.id);
      errors.push(`[${index}] Duplicate generated UI id: ${configuration.id}`);
    }
    ids.add(configuration.id);
    return true;
  });
  return {
    configurations: configurations.filter(({ id }) => !duplicates.has(id)),
    errors,
  };
};

export const normalizeGeneratedUiConfigurations = (value) => {
  const { configurations, errors } = parseGeneratedUiConfigurations(value);
  if (errors.length)
    throw new Error(`Invalid generated UI: ${errors.join(' ')}`);
  return configurations;
};
export const getGeneratedUiConfigurationsForPlacement = (value, placement) =>
  normalizeGeneratedUiConfigurations(value).filter((configuration) =>
    configuration.placements.includes(placement)
  );

const icons = {
  form: 'edit',
  profile: 'user',
  gallery: 'file',
  cta: 'star',
  info: 'info',
};
export const getGeneratedUiIcon = (componentType) =>
  icons[componentType] || 'code';
export const withGeneratedUiItems = (
  surfaceItems,
  menuItems,
  configurations
) => [
  ...new Set([
    ...surfaceItems.filter(
      (id) =>
        !configurations.some(
          (configuration) => `generated-ui-${configuration.id}` === id
        ) || !menuItems.includes(id)
    ),
    ...configurations
      .map(({ id }) => `generated-ui-${id}`)
      .filter((id) => !menuItems.includes(id)),
  ]),
];
