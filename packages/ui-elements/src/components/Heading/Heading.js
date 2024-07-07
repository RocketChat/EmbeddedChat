import React from 'react';
import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';

const Heading = ({ level = 1, children, ...props }) => {
  const { theme } = useTheme();
  console.log(theme);
  const Tag = `h${level}`;
  const style = theme.typography[Tag];
  return (
    <Tag
      css={css`
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        line-height: ${style.lineHeight};
      `}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;
