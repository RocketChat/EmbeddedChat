import { css } from '@emotion/react';
import { lighten, darken } from '@embeddedchat/ui-elements';

const getMessageAggregatorStyles = (theme, mode) => {
  const styles = {
    listContainerStyles: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: initial;
      align-items: initial;
      max-width: 100%;
    `,

    noMessageStyles: css`
      justify-content: center;
      align-items: center;
    `,

    centerColumnStyles: css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `,

    noteStyle: css`
      margin-left: 16px;
      margin-right: 16px;
      font-size: 0.875rem;
      color: ${mode === 'light'
        ? lighten(theme?.colors.foreground, 8)
        : darken(theme?.colors.foreground, 0.3)};
    `,
  };

  return styles;
};

export default getMessageAggregatorStyles;
