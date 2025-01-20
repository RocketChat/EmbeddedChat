import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Box, useTheme, Icon } from '@embeddedchat/ui-elements';
import PropTypes from 'prop-types';
import getAttachedFileStyles from './FileAttachment.styles';
import AttachmentMetadata from './AttachmentMetadata';

const FileAttachment = ({ attachment, host, variantStyles = {} }) => {
  const { theme } = useTheme();
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const handleTogglePreview = () => {
    setIsPreviewOpen((prev) => !prev);
  };
  const styles = getAttachedFileStyles(theme);
  return (
    <>
      <AttachmentMetadata
        attachment={attachment}
        host={host}
        onExpandCollapseClick={handleTogglePreview}
        isExpanded={isPreviewOpen}
      />

      {isPreviewOpen && (
        <Box css={styles.fileContainer}>
          <Box
            css={css`
              margin-bottom: 0.2rem;
              margin-top: 0.2rem;
              padding: 0.4rem;
              display: flex;
              align-items: center;
            `}
          >
            <Box
              css={css`
                display: flex;
                align-items: center;
                margin-bottom: 0.2rem;
              `}
            >
              <Icon name="file" size="40px" />
            </Box>
            <Box
              css={css`
                display: flex;
                flex-direction: column;
                margin-left: 0.1rem;
                font-size: 0.8rem;
                ${variantStyles.textUserInfo}
              `}
            >
              <div
                css={css`
                  color: ${theme.colors.text};
                `}
              >
                <a href={`${host}${attachment.title_link}`}>
                  {attachment.title}
                </a>
              </div>
              <Box
                css={css`
                  font-size: 0.7rem;
                `}
              >
                {attachment.size
                  ? attachment.size < 1024
                    ? `${attachment.size} bytes`
                    : attachment.size < 1048576
                    ? `${(attachment.size / 1024).toFixed(2)} kB`
                    : `${(attachment.size / 1048576).toFixed(2)} MB`
                  : '0 bytes'}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
export default FileAttachment;

FileAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
