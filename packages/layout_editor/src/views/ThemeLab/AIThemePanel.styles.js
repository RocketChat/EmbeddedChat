import { css } from '@emotion/react';

export const getAIThemePanelStyles = (theme) => ({
  panel: css`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    overflow: hidden;
  `,

  header: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem 0.75rem;
    border: 0;
    background: ${theme.colors.card};
    color: ${theme.colors.cardForeground};
    cursor: pointer;
    font: inherit;
    text-align: left;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: -2px;
    }
  `,

  headerTitle: css`
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.875rem;
    font-weight: 700;
  `,

  badge: css`
    padding: 0.12rem 0.38rem;
    border-radius: 999px;
    background: ${theme.colors.accent};
    color: ${theme.colors.accentForeground};
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  `,

  body: css`
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding: 0.75rem;
    background: ${theme.colors.background};
  `,

  intro: css`
    margin: 0;
    color: ${theme.colors.mutedForeground};
    font-size: 0.76rem;
    line-height: 1.45;
  `,

  sourceRow: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem;
    padding: 0.35rem 0;
  `,

  providerLabel: css`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: ${theme.colors.foreground};
    font-size: 0.76rem;
    font-weight: 600;
  `,

  providerSelect: css`
    min-width: 10rem;
    padding: 0.35rem 0.45rem;
    border: 1px solid ${theme.colors.input};
    border-radius: ${theme.radius};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font: inherit;
    font-size: 0.76rem;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 1px;
    }
  `,

  sourceHint: css`
    color: ${theme.colors.mutedForeground};
    font-size: 0.68rem;
  `,

  settingsDisclosure: css`
    padding: 0.45rem 0.55rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    background: ${theme.colors.card};

    > summary {
      color: ${theme.colors.mutedForeground};
      cursor: pointer;
      font-size: 0.7rem;
      font-weight: 600;
    }

    &[open] > summary {
      margin-bottom: 0.55rem;
      color: ${theme.colors.foreground};
    }
  `,

  fieldLabel: css`
    display: block;
    margin-bottom: 0.3rem;
    color: ${theme.colors.mutedForeground};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  `,

  input: css`
    box-sizing: border-box;
    width: 100%;
    padding: 0.45rem 0.55rem;
    border: 1px solid ${theme.colors.input};
    border-radius: ${theme.radius};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font: inherit;
    font-size: 0.78rem;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 1px;
    }
  `,

  textarea: css`
    box-sizing: border-box;
    width: 100%;
    min-height: 4.5rem;
    resize: vertical;
    padding: 0.45rem 0.55rem;
    border: 1px solid ${theme.colors.input};
    border-radius: ${theme.radius};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font: inherit;
    font-size: 0.78rem;
    line-height: 1.45;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 1px;
    }
  `,

  hint: css`
    margin: 0.3rem 0 0;
    color: ${theme.colors.mutedForeground};
    font-size: 0.68rem;
    line-height: 1.4;
  `,

  providerSettings: css`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  `,

  status: css`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: ${theme.colors.mutedForeground};
    font-size: 0.7rem;
    line-height: 1.4;
  `,

  preview: css`
    padding: 0.7rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    background: ${theme.colors.card};
  `,

  previewHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  `,

  swatchRow: css`
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.35rem;
  `,

  swatchItem: css`
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    gap: 0.22rem;
  `,

  swatchColor: css`
    width: 100%;
    height: 1.35rem;
    border: 1px solid ${theme.colors.border};
    border-radius: calc(${theme.radius} / 1.5);
  `,

  swatchLabel: css`
    overflow: hidden;
    max-width: 100%;
    color: ${theme.colors.mutedForeground};
    font-size: 0.6rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  styleControls: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
    margin-top: 0.6rem;
  `,

  styleControl: css`
    min-width: 0;
  `,

  fontSelect: css`
    position: relative;
    z-index: 3;

    .ec-static-select {
      width: 100%;
      min-width: 0;
    }

    .ec-static-select > div:first-of-type {
      min-height: 0;
      padding: 0.15rem 0.35rem;
      font-size: 0.68rem;
    }
  `,

  styleOptionRow: css`
    display: flex;
    overflow: hidden;
    border: 1px solid ${theme.colors.border};
    border-radius: calc(${theme.radius} / 1.5);
  `,

  styleOption: css`
    flex: 1;
    min-width: 0;
    padding: 0.3rem 0.18rem;
    border: 0;
    background: transparent;
    color: ${theme.colors.mutedForeground};
    cursor: pointer;
    font: inherit;
    font-size: 0.62rem;
  `,

  styleOptionActive: css`
    flex: 1;
    min-width: 0;
    padding: 0.3rem 0.18rem;
    border: 0;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    cursor: pointer;
    font: inherit;
    font-size: 0.62rem;
    font-weight: 700;
  `,

  paletteEditor: css`
    margin-top: 0.7rem;
    padding: 0.55rem;
    border: 1px solid ${theme.colors.border};
    border-radius: calc(${theme.radius} / 1.5);
    background: ${theme.colors.background};

    > summary {
      color: ${theme.colors.foreground};
      cursor: pointer;
      font-size: 0.72rem;
      font-weight: 700;
    }

    &[open] > summary {
      margin-bottom: 0.6rem;
    }
  `,

  paletteEditorHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  `,

  paletteModeToggle: css`
    display: inline-flex;
    overflow: hidden;
    border: 1px solid ${theme.colors.border};
    border-radius: calc(${theme.radius} / 1.5);
  `,

  paletteModeButton: css`
    padding: 0.22rem 0.42rem;
    border: 0;
    background: transparent;
    color: ${theme.colors.mutedForeground};
    cursor: pointer;
    font: inherit;
    font-size: 0.62rem;
    text-transform: capitalize;
  `,

  paletteModeActive: css`
    padding: 0.22rem 0.42rem;
    border: 0;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    cursor: pointer;
    font: inherit;
    font-size: 0.62rem;
    text-transform: capitalize;
  `,

  paletteControls: css`
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  `,

  paletteGroup: css`
    border: 1px solid ${theme.colors.border};
    border-radius: calc(${theme.radius} / 1.5);
    background: ${theme.colors.background};

    > summary {
      padding: 0.4rem 0.45rem;
      color: ${theme.colors.foreground};
      cursor: pointer;
      font-size: 0.68rem;
      font-weight: 700;
    }
  `,

  paletteTokenGrid: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.4rem;
    padding: 0 0.4rem 0.4rem;
  `,

  paletteControl: css`
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
    padding: 0.38rem;
    border: 1px solid ${theme.colors.border};
    border-radius: calc(${theme.radius} / 1.5);
    color: ${theme.colors.foreground};
    font-size: 0.68rem;
    font-weight: 600;
  `,

  colorPickerTrigger: css`
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: 1px solid ${theme.colors.border};
    border-radius: calc(${theme.radius} / 1.5);
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 2px;
    }
  `,

  colorPickerPopup: css`
    position: absolute;
    top: calc(100% + 0.35rem);
    left: 0;
    z-index: 2;
    box-shadow: ${theme.shadows[2]};

    .saturation-white,
    .saturation-black,
    .hue-horizontal {
      cursor: pointer;
    }
  `,

  colorCode: css`
    grid-column: 1 / -1;
    overflow: hidden;
    color: ${theme.colors.mutedForeground};
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.62rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  accentPreview: css`
    margin-top: 0.55rem;
    padding: 0.35rem 0.55rem;
    border-radius: calc(${theme.radius} / 1.5);
    font-size: 0.7rem;
    font-weight: 700;
    text-align: center;
  `,

  ollamaChip: css`
    padding: 0.15rem 0.4rem;
    border-radius: 999px;
    background: ${theme.colors.info};
    color: ${theme.colors.infoForeground};
    font-size: 0.64rem;
    font-weight: 600;
  `,

  localChip: css`
    padding: 0.15rem 0.4rem;
    border-radius: 999px;
    background: ${theme.colors.muted};
    color: ${theme.colors.mutedForeground};
    font-size: 0.64rem;
    font-weight: 600;
  `,

  passedReport: css`
    margin-top: 0.65rem;
    color: ${theme.colors.successForeground};
    font-size: 0.7rem;
    line-height: 1.4;
  `,

  failedReport: css`
    margin-top: 0.65rem;
    color: ${theme.colors.destructive};
    font-size: 0.7rem;
    line-height: 1.4;
  `,

  followUp: css`
    padding: 0.55rem 0 0;
    border-top: 1px solid ${theme.colors.border};
  `,

  followUpInput: css`
    box-sizing: border-box;
    width: 100%;
    min-height: 3.2rem;
    resize: vertical;
    padding: 0.45rem 0.55rem;
    border: 1px solid ${theme.colors.input};
    border-radius: ${theme.radius};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font: inherit;
    font-size: 0.78rem;
    line-height: 1.45;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 1px;
    }
  `,

  followUpActions: css`
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-top: 0.45rem;

    > button:first-of-type {
      width: auto;
    }
  `,

  btnRow: css`
    display: flex;
    gap: 0.45rem;
  `,

  generateBtn: css`
    flex: 1;
    padding: 0.48rem 0.7rem;
    border: 0;
    border-radius: ${theme.radius};
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    cursor: pointer;
    font: inherit;
    font-size: 0.76rem;
    font-weight: 700;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  `,

  applyBtn: css`
    flex: 1;
    padding: 0.48rem 0.7rem;
    border: 0;
    border-radius: ${theme.radius};
    background: ${theme.colors.success};
    color: ${theme.colors.successForeground};
    cursor: pointer;
    font: inherit;
    font-size: 0.76rem;
    font-weight: 700;
  `,

  secondaryBtn: css`
    width: 100%;
    padding: 0.48rem 0.7rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    background: transparent;
    color: ${theme.colors.foreground};
    cursor: pointer;
    font: inherit;
    font-size: 0.76rem;
  `,

  exportRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  `,

  textBtn: css`
    padding: 0;
    border: 0;
    background: transparent;
    color: ${theme.colors.primary};
    cursor: pointer;
    font: inherit;
    font-size: 0.7rem;
    font-weight: 600;
    text-decoration: underline;
  `,

  dot: css`
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: ${theme.colors.primary};
    animation: ai-theme-pulse 1s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    @keyframes ai-theme-pulse {
      50% {
        opacity: 0.3;
      }
    }
  `,
});
