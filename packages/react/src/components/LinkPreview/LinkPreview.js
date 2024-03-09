import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import { Icon } from '../Icon';
import useComponentOverrides from '../../theme/useComponentOverrides';

const LinkPreview = ({ className = '', style = {}, url, meta, ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('LinkPreview');
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  if (!meta || (typeof meta === 'object' && Object.keys(meta).length === 0)) {
    return null;
  }

  const isDescription =
    meta.oembedAuthorName || meta.ogDescription || meta.description;
  const isTitle = meta.pageTitle || meta.ogTitle || meta.oembedTitle;
  const isThumbnail = meta.oembedThumbnailUrl || meta.ogImage;
  const isSiteName = meta.ogSiteName || meta.oembedProviderName;

  const ArrowDropDownCss = css`
    cursor: pointer;
    display: flex;
    align-items: center;
  `;

  const LinkPreviewBoxCss = css`
    max-width: 22rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    margin-bottom: 0.75rem;
    overflow: hidden;
  `;

  const TextCss = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-block-start: 0rem;
    margin-block-end: 0rem;
  `;

  const handleTogglePreview = () => {
    setIsPreviewOpen((prev) => !prev);
  };

  return (
    <>
      <Box css={ArrowDropDownCss}>
        Link Preview
        <ActionButton
          onClick={handleTogglePreview}
          ghost
          display="inline"
          square
          small
        >
          {isPreviewOpen ? (
            <Icon name="chevron-left" size="1.25rem" />
          ) : (
            <Icon name="chevron-down" size="1.25rem" />
          )}
        </ActionButton>
      </Box>

      {isPreviewOpen && (
        <Box
          css={LinkPreviewBoxCss}
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
              style={{ color: 'blue' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isTitle && <p css={TextCss}>{isTitle}</p>}
            </a>
            {isDescription && <p css={TextCss}>{isDescription}</p>}
            {isSiteName && (
              <a
                href={url}
                style={{ color: 'rgba(97, 97, 97, 1)' }}
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
