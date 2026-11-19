import { css } from '@emotion/react';

const getPinnedMessageBannerStyles = ({ theme }) => ({
  banner: css`
    display: flex;
    align-items: center;
    background-color: ${theme.colors.primary}1a;
    border-left: 3px solid ${theme.colors.primary};
    padding: 0.35rem 0.75rem;
    width: 100%;
    box-sizing: border-box;
    gap: 0.5rem;
    min-height: 2.5rem;
    position: relative;
    z-index: 1100;
  `,
  pinIcon: css`
    flex-shrink: 0;
    color: ${theme.colors.primary};
  `,
  content: css`
    flex: 1;
    min-width: 0;
    cursor: pointer;
    overflow: hidden;
  `,
  label: css`
    font-size: 0.65rem;
    font-weight: 600;
    color: ${theme.colors.primary};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1.2;
  `,
  text: css`
    font-size: 0.8rem;
    color: ${theme.colors.foreground};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  `,
  controls: css`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  `,
  counter: css`
    font-size: 0.7rem;
    color: ${theme.colors.secondary};
    white-space: nowrap;
  `,
  navButton: css`
    background: none;
    border: none;
    padding: 0.2rem;
    cursor: pointer;
    color: ${theme.colors.secondary};
    display: flex;
    align-items: center;
    border-radius: 3px;
    &:hover {
      background-color: ${theme.colors.primary}33;
      color: ${theme.colors.primary};
    }
  `,
  closeButton: css`
    background: none;
    border: none;
    padding: 0.2rem;
    cursor: pointer;
    color: ${theme.colors.secondary};
    display: flex;
    align-items: center;
    border-radius: 3px;
    margin-left: 0.25rem;
    &:hover {
      background-color: ${theme.colors.danger}33;
      color: ${theme.colors.danger};
    }
  `,
});

export default getPinnedMessageBannerStyles;
