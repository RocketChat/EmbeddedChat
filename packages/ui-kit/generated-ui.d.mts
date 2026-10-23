export interface GeneratedUiConfiguration {
  version: 1;
  id: string;
  title?: string;
  blocks: Record<string, unknown>[];
  surface: 'message' | 'contextualBar' | 'modal';
  componentType: 'form' | 'profile' | 'gallery' | 'cta' | 'info';
  placements: ('composer' | 'messageToolbox')[];
}
export const GENERATED_UI_CONFIGURATION_VERSION: 1;
export const GENERATED_UI_SURFACES: GeneratedUiConfiguration['surface'][];
export const GENERATED_UI_COMPONENT_TYPES: GeneratedUiConfiguration['componentType'][];
export const GENERATED_UI_PLACEMENTS: GeneratedUiConfiguration['placements'];
export const MAX_GENERATED_UI_BYTES: number;
export const UI_KIT_JSON_SCHEMA: Record<string, unknown>;
export const GENERATED_UI_CONFIGURATION_SCHEMA: Record<string, unknown>;
export function validateGeneratedUiBlocks(value: unknown): {
  valid: boolean;
  errors: string[];
};
export function validateGeneratedUiConfiguration(value: unknown): {
  valid: boolean;
  errors: string[];
};
export function isGeneratedUiConfiguration(
  value: unknown
): value is GeneratedUiConfiguration;
export function createGeneratedUiConfiguration(
  value?: Partial<Omit<GeneratedUiConfiguration, 'version'>>
): GeneratedUiConfiguration;
export function parseGeneratedUiConfigurations(value: unknown): {
  configurations: GeneratedUiConfiguration[];
  errors: string[];
};
export function normalizeGeneratedUiConfigurations(
  value: unknown
): GeneratedUiConfiguration[];
export function getGeneratedUiConfigurationsForPlacement(
  value: unknown,
  placement: string
): GeneratedUiConfiguration[];
export function getGeneratedUiIcon(componentType: string): string;
export function withGeneratedUiItems(
  surfaceItems: string[],
  menuItems: string[],
  configurations: GeneratedUiConfiguration[]
): string[];
