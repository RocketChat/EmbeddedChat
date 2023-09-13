import { css } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { AvatarContainer } from './AvatarContainer';

export const Avatar = ({
  size = '2.25rem',
  className = '',
  style = {},
  url,
  ...props
}) => {
  const AvatarCss = css`
    border-radius: 0.25rem;
    height: ${size};
    width: ${size};
  `;
  const { classNames, styleOverrides } = useComponentOverrides(
    'Avatar',
    className,
    style
  );

  return (
    <AvatarContainer size={size} {...props}>
      <img
        src={`${url}`}
        css={AvatarCss}
        className={classNames}
        style={styleOverrides}
      />
    </AvatarContainer>
  );
};
