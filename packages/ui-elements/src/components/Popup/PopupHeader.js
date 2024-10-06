import React, { useRef } from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { getPopupHeaderStyles } from './Popup.styles';
import Heading from '../Heading/Heading';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { Input } from '../Input';
import { useTheme } from '../../hooks';

export const PopupHeader = ({
  className = '',
  style = {},
  title,
  iconName,
  searchProps,
  onClose = () => {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('PopupHeader');
  const theme = useTheme();
  const styles = getPopupHeaderStyles(theme);
  const {
    isSearch = false,
    handleInputChange,
    placeholder,
  } = searchProps || {};
  const searchContainerRef = useRef(null);
  const handleFocus = () => {
    if (searchContainerRef.current) {
      searchContainerRef.current.classList.add('focused');
    }
  };

  const handleBlur = () => {
    if (searchContainerRef.current) {
      searchContainerRef.current.classList.remove('focused');
    }
  };
  return (
    <Box
      css={styles.popupHeader}
      className={`ec-popup-header ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      <Box css={styles.titleContainer}>
        <Icon css={styles.icon} name={iconName} size="1.25rem" />
        <Heading level={5} style={{ display: 'contents', fontWeight: 700 }}>
          {title}
        </Heading>

        {isSearch && (
          <Box
            css={styles.searchContainer}
            style={{
              position: 'relative',
            }}
            ref={searchContainerRef}
          >
            <Input
              placeholder={placeholder}
              onChange={handleInputChange}
              css={styles.textInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            <Icon name="magnifier" size="1.25rem" css={styles.noInfoIcon} />
          </Box>
        )}
      </Box>

      <ActionButton onClick={() => onClose()} ghost size="small">
        <Icon name="cross" />
      </ActionButton>
    </Box>
  );
};
