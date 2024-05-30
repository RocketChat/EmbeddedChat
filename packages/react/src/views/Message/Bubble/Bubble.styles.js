import { css } from '@emotion/react';
import { useCustomTheme } from '../../../hooks/useCustomTheme';

export const useBubbleMessageStyles = () => {
  const { theme, colors } = useCustomTheme();

  const main = css`
    display: flex;
    gap: 0.25rem;
    flex-direction: row;
    align-items: center;
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
    padding-left: 2.25rem;
    padding-right: 2.25rem;
    color: ${colors.foreground};
  `;

  const body = css`
    display: flex;
    justify-self: flex-start;
    flex-direction: column;
  `;

  const me = css`
    flex-direction: row-reverse;
  `;

  const messageContainer = css`
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    flex-shrink: 1;
    transition: opacity 0.3s linear;
    word-break: break-word;
    opacity: 1;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;

    width: fit-content;
    max-width: 80%;
    padding: 0.5rem 0.75rem;
    border-radius: 0 ${theme.schemes.radius} ${theme.schemes.radius};
    background: ${colors.primary};
    color: ${colors.primaryForeground};
  `;

  const messageContainerMe = css`
    background: ${colors.secondary};
    color: ${colors.secondaryForeground};
    border-radius: ${theme.schemes.radius} 0 ${theme.schemes.radius}
      ${theme.schemes.radius};
  `;

  return {
    main,
    me,
    messageContainer,
    messageContainerMe,
    body,
  };
};
