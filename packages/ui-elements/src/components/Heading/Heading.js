import React from 'react';
import { css } from '@emotion/react';
import { useTheme } from '../../hooks';

const Heading = ({ level = 1, children, ...props }) => {
  const defaultTypography = {
    h1: {
      fontSize: '2rem',
      fontWeight: 800,
      lineHeight: 1.5,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 800,
      lineHeight: 1.4,
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '0.83rem',
      fontWeight: 400,
      lineHeight: 1.1,
    },
    h6: {
      fontSize: '0.67rem',
      fontWeight: 500,
      lineHeight: 1.0,
    },
  };

  const Tag = `h${level}`;
  const { theme } = useTheme();
  const style = {
    ...defaultTypography[Tag],
    ...(theme.typography?.[Tag] || {}),
  };

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
