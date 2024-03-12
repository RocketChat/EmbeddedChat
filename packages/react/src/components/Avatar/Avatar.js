import { css } from '@emotion/react';
import React, { useState } from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { AvatarContainer } from './AvatarContainer';
import { Icon } from '../Icon';
import { Box } from '../Box';

export const Avatar = ({
  size = '2.25rem',
  className = '',
  style = {},
  url,
  fallbackIcon = 'circle-cross',
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const AvatarCss = css`
    border-radius: 0.25rem;
    height: ${size};
    width: ${size};
  `;

  const FallBackBoxCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #007fff;
    color: #ffffff;
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
      {!imgError ? (
        <img
          src={`${url}`}
          css={AvatarCss}
          className={classNames}
          style={styleOverrides}
          onError={() => setImgError(true)}
        />
      ) : (
        <Box css={FallBackBoxCss} style={{}} color="blue">
          <Icon name={fallbackIcon} size="1.25rem" />
        </Box>
      )}
    </AvatarContainer>
  );
};
