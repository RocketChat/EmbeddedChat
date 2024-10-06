import { css } from '@emotion/react';

export const getEditorStyles = (theme) => {
  const styles = {
    embeddedchat: css`
      width: 75%;
      position: relative;
      background: ${theme.colors.background};
      color: ${theme.colors.foreground};
      display: flex;
      flex: 1;
      flex-direction: column;
      border: ${`1.5px solid  ${theme.colors.border}`};
      border-radius: ${theme.radius};
      overflow: hidden;
    `,

    layoutEditor: css`
      background: ${theme.colors.background};
      color: ${theme.colors.foreground};
      height: 100vh;
      display: flex;
      gap: 0.25rem;
    `,
  };

  return styles;
};
