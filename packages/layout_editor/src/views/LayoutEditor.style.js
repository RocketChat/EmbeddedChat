import { css } from '@emotion/react';

export const getEditorStyles = ({ theme, colors }) => {
  const styles = {
    embeddedchat: css`
      width: 75%;
      position: relative;
      background: ${colors.background};
      color: ${colors.foreground};
      display: flex;
      flex: 1;
      flex-direction: column;
      border: ${`1.5px solid  ${theme.schemes.border}`};
      border-radius: ${theme.radius};
      overflow: hidden;
    `,

    layoutEditor: css`
      background: ${colors.background};
      color: ${colors.foreground};
      height: 100vh;
      display: flex;
      gap: 0.25rem;
    `,
  };

  return styles;
};
