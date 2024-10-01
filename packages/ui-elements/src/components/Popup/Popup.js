import React, { useRef, useEffect } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import ReactPortal from '../../lib/reactPortal';
import { getPopupStyles } from './Popup.styles';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { PopupHeader } from './PopupHeader';
import { useTheme } from '../../hooks';

const Popup = ({
  positionStyles = css`
    position: absolute;
    top: 2.75rem;
    right: 2rem;
  `,
  wrapperId = 'overlay-items',
  isPopupHeader = false,
  searchProps = {},
  children,
  onClose = () => {},
  title,
  iconName,
  style = {},
  width = '420px',
  height = '350px',
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('Popup');
  const { theme } = useTheme();
  const styles = getPopupStyles(theme);

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !event.target.classList.contains('ec-menu-item')
      ) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <ReactPortal wrapperId={wrapperId}>
      <Box
        ref={popupRef}
        css={[styles.popup(width, height), positionStyles]}
        className={`ec-popup ${classNames}`}
        style={{ ...styleOverrides, ...style }}
      >
        {isPopupHeader && (
          <PopupHeader
            title={title}
            iconName={iconName}
            searchProps={searchProps}
            onClose={onClose}
          />
        )}
        <Box css={styles.popupContent}>{children}</Box>
      </Box>
    </ReactPortal>
  );
};

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  positionStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  wrapperId: PropTypes.string,
  onClose: PropTypes.func,
};

export default Popup;
