import { css } from '@emotion/react';
import { useCustomTheme } from '../../../hooks/useCustomTheme';

export const useBubbleMessageStyles = () => {
  const { theme, colors } = useCustomTheme();

  const main = css`
    display: flex;
    gap: 0.25rem;
    flex-direction: row;
    align-items: center;
    padding: 0 2.25rem 0.25rem 2.25rem;
    color: ${colors.foreground};
  `;

  const me = css`
    flex-direction: row-reverse;
  `;

  const body = css`
    display: flex;
    flex: 1;
    align-items: flex-start;
    flex-direction: column;
  `;

  const bodyMe = css`
    align-items: flex-end;
  `;

  const messageContainer = css`
    position: relative;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    transition: opacity 0.3s linear;
    word-break: break-word;
    opacity: 1;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;

    width: fit-content;
    max-width: 80%;
    padding: 0.5rem 0.75rem;
    border-radius: ${theme.schemes.radius} ${theme.schemes.radius}
      ${theme.schemes.radius} 0.2rem;
    background: ${colors.primary};
    color: ${colors.primaryForeground};
  `;

  const messageContainerMe = css`
    background: ${colors.secondary};
    color: ${colors.secondaryForeground};
    border-radius: ${theme.schemes.radius} ${theme.schemes.radius} 0.2rem
      ${theme.schemes.radius};
  `;

  const lastSequentialMe = css`
    border-radius: ${theme.schemes.radius} 0.2rem ${theme.schemes.radius}
      ${theme.schemes.radius};
  `;

  const sequentialMe = css`
    border-radius: ${theme.schemes.radius} 0.2rem 0.2rem ${theme.schemes.radius};
  `;

  const sequential = css`
    border-radius: 0.2rem ${theme.schemes.radius} ${theme.schemes.radius} 0.2rem;
  `;
  const lastSequential = css`
    border-radius: 0.2rem ${theme.schemes.radius} ${theme.schemes.radius};
  `;

  return {
    main,
    me,
    messageContainer,
    messageContainerMe,
    body,
    lastSequentialMe,
    sequentialMe,
    sequential,
    lastSequential,
    bodyMe,
  };
};
