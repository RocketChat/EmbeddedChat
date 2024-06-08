import React, { useRef, useEffect } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import ReactPortal from '../../lib/reactPortal';
import { usePopupStyles } from './Popup.styles';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { PopupHeader } from './PopupHeader';

const Popup = ({
  positionStyles = css`
    position: absolute;
    top: 2rem;
    right: 2rem;
  `,
  wrapperId = 'popup',
  isPopupHeader = false,
  searchProps = {},
  children,
  onClose = () => {},
  title,
  iconName,
  style = {},
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('Popup');
  const styles = usePopupStyles();

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
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
        css={[styles.popup, positionStyles]}
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
        {children}
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
