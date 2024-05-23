import React from 'react';
import { css, useTheme } from '@emotion/react';

const Heading = ({ level = 1, children, ...props }) => {
  const theme = useTheme();
  const Tag = `h${level}`;
  const style = theme.typography[Tag];
  console.log(props);
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
