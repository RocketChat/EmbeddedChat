import React from 'react';
import { css } from '@emotion/react';
import { ActionButton, Box } from '@embeddedchat/ui-elements';

const AttachmentMetadata = ({ attachment, url, variantStyles = {}, msg }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      const downloadUrl = URL.createObjectURL(data);

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = attachment.title || 'download';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <Box
      css={[
        css`
          display: flex;
          margin-top: 7px;
          flex-direction: column;
        `,
        variantStyles.attachmentMetaContainer,
      ]}
    >
      <div
        css={
          attachment.description !== ''
            ? [
                css`
                  margin: 10px 0px;
                  display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: wrap;
                `,
              ]
            : css`
                margin: -7px 0px;
              `
        }
      >
        {msg ? (
          <Markdown body={msg} md={attachment.descriptionMd} />
        ) : (
          attachment.description
        )}
      </div>
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
        `}
      >
        {attachment.title && (
          <p
          css={
            attachment.description
              ? [
                  css`
                    margin: 0px;
                    font-size: 14px;
                    opacity: 0.7;
                    flex-wrap: wrap;

                  `,
                ]
              : css`
                  margin: 22px 0 15px 0;
                  font-size: 14px;
                  opacity: 0.7;
                `
          }
          >
            {attachment.title}
          </p>
        )}

        <Box
          css={css`
            margin-top: 7px;
            margin-left: 5px;
            font-size: 14px;
            opacity: 0.7;
          `}
        >
          (
          {attachment.image_size
            ? (attachment.image_size / 1024).toFixed(2)
            : 0}
            {' '} 
          kB)
        </Box>

        <ActionButton
          ghost
          icon="download"
          size="small"
          onClick={handleDownload}
          css={css`
            margin-left: 10px;
            margin-top: 5px;
          `}
        />
      </Box>
    </Box>
  );
};

export default AttachmentMetadata;
