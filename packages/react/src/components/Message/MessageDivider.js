import { css } from '@emotion/react';
import React from 'react';
import { appendClassNames } from '../../lib/appendClassNames';
import useComponentOverrides from '../../theme/useComponentOverrides';

const MessageDividerCss = css`
  letter-spacing: 0rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1rem;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-inline: 1.25rem;
  color: #2f343d;
`;

const BarCss = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
  background-color: #2f343d;
  height: 1px;
`;

const DividerWrapperCss = css`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-block: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-inline: 0.5rem;
  background-color: white;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const MessageDivider = ({
  children,
  unreadLabel,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageDivider',
    className,
    style
  );
  return (
    <div
      role="separator"
      css={MessageDividerCss}
      className={appendClassNames('ec-message-divider', classNames)}
      style={styleOverrides}
      {...props}
    >
      {children && (
        <>
          <div css={BarCss} className="ec-message-divider-bar" />
          <div css={DividerWrapperCss} className="ec-message-divider-content">
            {children}
          </div>{' '}
        </>
      )}
    </div>
  );
};
