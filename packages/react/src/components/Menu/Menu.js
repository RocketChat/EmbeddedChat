import React, { useEffect, useMemo, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import MenuItem from './MenuItem';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { Tooltip } from '../Tooltip';

const MenuWrapperCss = css`
  position: relative;
  display: inline-block;
`;

const MenuCss = css`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  z-index: 1100;
  border-radius: 0.2em;
  padding: 0.2em 0;
  background-color: #fff;
`;

const Menu = ({
  options = [],
  className = '',
  style = {},
  anchor = 'right bottom',
  isToolTip = true,
}) => {
  const theme = useTheme();
  const shadowCss = css`
    box-shadow: ${theme.shadows[2]};
  `;
  const { classNames, styleOverrides } = useComponentOverrides(
    'Menu',
    className,
    style
  );
  const anchorStyle = useMemo(() => {
    const positions = anchor.split(/\s+/);
    const styleAnchor = {};
    positions.forEach((pos) => {
      styleAnchor[pos] = 0;
    });
    return styleAnchor;
  }, [anchor]);

  const finalStyle = useMemo(
    () => ({ ...styleOverrides, ...anchorStyle }),
    [anchorStyle, styleOverrides]
  );

  const { classNames: wrapperClasses, styleOverrides: wrapperStyles } =
    useComponentOverrides('MenuWrapper');

  const [isOpen, setOpen] = useState(false);

  const onClick = (action, disabled) => () => {
    if (!disabled) {
      action();
      setOpen(!isOpen);
    }
  };

  useEffect(() => {
    const onBodyClick = (e) => {
      if (!e.target.closest('.ec-menu-wrapper')) {
        setOpen(false);
      }
    };
    document.body.addEventListener('click', onBodyClick);

    return () => document.body.removeEventListener('click', onBodyClick);
  }, []);

  return (
    <div
      css={MenuWrapperCss}
      className={appendClassNames('ec-menu-wrapper', wrapperClasses)}
      style={wrapperStyles}
    >
      {isToolTip ? (
        <Tooltip text="Options" position="bottom">
          {' '}
          <ActionButton ghost icon="kebab" onClick={() => setOpen(!isOpen)} />
        </Tooltip>
      ) : (
        <ActionButton ghost icon="kebab" onClick={() => setOpen(!isOpen)} />
      )}
      {isOpen ? (
        <Box
          css={[MenuCss, shadowCss]}
          className={appendClassNames('ec-menu', classNames)}
          style={finalStyle}
        >
          {options.map((option, idx) => (
            <MenuItem
              {...option}
              key={option.id || idx}
              action={onClick(option.action, option.disabled)}
            />
          ))}
        </Box>
      ) : null}
    </div>
  );
};

export default Menu;
