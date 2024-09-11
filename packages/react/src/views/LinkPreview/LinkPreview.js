import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import {
  Box,
  ActionButton,
  Icon,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import getLinkPreviewStyles from './LinkPreview.styles';

const LinkPreview = ({
  className = '',
  style = {},
  url,
  meta,
  showDropdown = true,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('LinkPreview');
  const { theme } = useTheme();
  const styles = getLinkPreviewStyles(theme);

  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  if (!meta || (typeof meta === 'object' && Object.keys(meta).length === 0)) {
    return null;
  }

  const isDescription =
    meta.oembedAuthorName || meta.ogDescription || meta.description;
  const isTitle = meta.pageTitle || meta.ogTitle || meta.oembedTitle;
  const isThumbnail = meta.oembedThumbnailUrl || meta.ogImage;
  const isSiteName = meta.ogSiteName || meta.oembedProviderName;

  const handleTogglePreview = () => {
    setIsPreviewOpen((prev) => !prev);
  };

  return (
    <>
      {showDropdown && (
        <Box css={styles.arrowDropDown}>
          Link Preview
          <ActionButton
            onClick={handleTogglePreview}
            ghost
            display="inline"
            square
            size="small"
          >
            {isPreviewOpen ? (
              <Icon name="chevron-left" size="1.25rem" />
            ) : (
              <Icon name="chevron-down" size="1.25rem" />
            )}
          </ActionButton>
        </Box>
      )}

      {isPreviewOpen && (
        <Box
          css={[styles.linkPreviewContainer]}
          className={`ec-linkpreview ${className} ${classNames}`}
          style={{ ...styleOverrides, ...style }}
          {...props}
        >
          {isThumbnail && (
            <Box style={{ overflow: 'hidden' }}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={
                    isThumbnail.startsWith('/')
                      ? `${url}${isThumbnail}`
                      : isThumbnail
                  }
                  alt={meta.ogImageAlt}
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </a>
            </Box>
          )}

          <Box style={{ padding: '8px' }}>
            <a
              href={url}
              css={css`
                color: ${theme.colors.foreground};
              `}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isTitle && <p css={styles.textStyle}>{isTitle}</p>}
            </a>
            {isDescription && <p css={styles.textStyle}>{isDescription}</p>}
            {isSiteName && (
              <a
                href={url}
                css={css`
                  color: ${theme.colors.foreground};
                `}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isSiteName}
              </a>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

LinkPreview.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  url: PropTypes.string,
  meta: PropTypes.object,
};
export default LinkPreview;
