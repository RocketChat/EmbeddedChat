import { css } from '@emotion/react';

export const getAICodePanelStyles = (theme) => ({
  panel: css`
    padding: 0.5rem;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.25rem;
  `,

  header: css`
    width: 100%;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.25rem 0;
    user-select: none;
    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 2px;
    }
  `,

  headerTitle: css`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    font-weight: 600;
  `,

  badge: css`
    font-size: 0.6rem;
    padding: 0.1rem 0.4rem;
    border-radius: 1rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  `,

  body: css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 0.75rem;
  `,

  fieldLabel: css`
    font-size: 0.72rem;
    font-weight: 600;
    color: ${theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.2rem;
    display: block;
  `,

  input: css`
    width: 100%;
    font-size: 0.8rem;
    padding: 0.35rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: ${theme.colors.ring};
    }
  `,

  textarea: css`
    width: 100%;
    min-height: 3.5rem;
    resize: vertical;
    font-size: 0.8rem;
    padding: 0.35rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: ${theme.colors.ring};
    }
  `,

  hint: css`
    font-size: 0.68rem;
    color: ${theme.colors.mutedForeground};
    line-height: 1.5;
    margin: 0;
  `,

  generateBtn: css`
    width: 100%;
    font-size: 0.78rem;
    padding: 0.4rem 0.75rem;
    border-radius: 0.25rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    border: none;
    cursor: pointer;
    font-weight: 600;
    &:hover {
      opacity: 0.9;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,

  actionsFooter: css`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  `,

  actionsRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  `,

  actionButton: css`
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 2px;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,

  secondaryAction: css`
    background: transparent;
    color: ${theme.colors.foreground};
    border-color: ${theme.colors.border};
    &:hover:not(:disabled) {
      background: ${theme.colors.muted};
    }
  `,

  applyAction: css`
    flex: 1 1 9.5rem;
  `,

  exportControl: css`
    position: relative;
    flex: 1 1 6.5rem;
    min-width: 0;
  `,

  exportAction: css`
    width: 100%;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,

  exportMenu: css`
    box-sizing: border-box;
    position: absolute;
    inset-inline-end: 0;
    bottom: calc(100% + 0.5rem);
    z-index: 1;
    width: max-content;
    min-width: 100%;
    padding: 0.25rem;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.25rem;
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
  `,

  exportMenuItem: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 0.25rem;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.78rem;
    text-align: start;
    white-space: nowrap;
    cursor: pointer;
    &:hover,
    &:focus-visible {
      background: ${theme.colors.muted};
    }
    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: -2px;
    }
  `,

  resetBtn: css`
    align-self: flex-end;
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 0.25rem;
    background: transparent;
    color: ${theme.colors.mutedForeground};
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    &:hover {
      color: ${theme.colors.foreground};
      background: ${theme.colors.muted};
    }
    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 2px;
    }
  `,

  syncAction: css`
    width: 100%;
    white-space: normal;
  `,

  processingRow: css`
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    color: ${theme.colors.mutedForeground};
  `,

  dot: css`
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: ${theme.colors.primary};
    display: inline-block;
    animation: ai-pulse 1s infinite;
    @keyframes ai-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.25;
      }
    }
  `,

  codeWrapper: css`
    position: relative;
    border-radius: 0.25rem;
    border: 1px solid #2d2d2d;
    overflow: hidden;
    margin-top: 0.5rem;
  `,

  codeHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1a1a1a;
    padding: 0.3rem 0.5rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: #888888;
    border-bottom: 1px solid #2d2d2d;
  `,

  copyIconBtn: css`
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    color: #888888;
    &:hover {
      color: #ffffff;
    }
  `,

  syntaxBox: css`
    margin: 0 !important;
    padding: 0.5rem !important;
    font-size: 0.75rem !important;
    background: #1e1e1e !important;
    max-height: 15rem;
    overflow-y: auto;
  `,

  tabRow: css`
    display: flex;
    border-bottom: 1px solid ${theme.colors.border};
    margin-top: 0.5rem;
  `,

  tabBtn: css`
    flex: 1;
    font-size: 0.75rem;
    padding: 0.4rem 0.75rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-weight: 600;
    color: ${theme.colors.mutedForeground};
    &:hover {
      color: ${theme.colors.foreground};
    }
  `,

  tabBtnActive: css`
    color: ${theme.colors.foreground};
    border-bottom-color: ${theme.colors.primary};
  `,

  previewBox: css`
    padding: 1rem;
    border: 1px solid ${theme.colors.border};
    border-top: none;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    background: ${theme.colors.background};
    min-height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  `,

  devModeControl: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid ${theme.colors.border};
  `,

  devModeTitle: css`
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    color: ${theme.colors.foreground};
  `,

  devModeHint: css`
    margin: 0.15rem 0 0;
    font-size: 0.68rem;
    line-height: 1.35;
    color: ${theme.colors.mutedForeground};
  `,

  devModeSwitch: css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    width: 2.25rem;
    height: 1.25rem;
    padding: 0.125rem;
    border: 1px solid ${theme.colors.border};
    border-radius: 999px;
    background: ${theme.colors.muted};
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;

    &:focus-visible {
      outline: 2px solid ${theme.colors.ring};
      outline-offset: 2px;
    }
  `,

  devModeSwitchActive: css`
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primary};
  `,

  devModeThumb: css`
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${theme.commonColors.white};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease;
  `,

  devModeThumbActive: css`
    transform: translateX(1rem);
  `,
});
