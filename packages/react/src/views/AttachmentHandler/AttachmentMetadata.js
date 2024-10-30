import React from 'react';
import { css } from '@emotion/react';
import { ActionButton, Box } from '@embeddedchat/ui-elements';
import { useUserStore } from '../../store';

const AttachmentMetadata = ({ attachment, url, variantStyles = {} }) => {
  const { username } = useUserStore((state) => ({
    username: state.username,
  }));

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
  const parseMentions = (msg) => {
    const mentionRegex = /(@\w+)/g;
    const parts = msg.split(mentionRegex);
    return parts;
  };

  const parts = parseMentions(attachment.description);

  return (
    <Box
      css={[
        css`
          display: flex;
          flex-direction: column;
        `,
        variantStyles.attachmentMetaContainer,
      ]}
    >
      <div>
        {parts.map((part, index) =>
          part.startsWith('@') ? (
            part.slice(1) !== username ? (
              <span
                key={index}
                css={css`
                  color: #71717a;
                  font-weight: bold;
                  background-color: #f4f4f5;
                  padding: 1.5px;
                  border-radius: 3px;
                `}
              >
                {part.slice(1)}
              </span>
            ) : (
              <span
                key={index}
                css={css`
                  color: #fafafa;
                  font-weight: bold;
                  background-color: #ef4444;
                  padding: 1.5px;
                  border-radius: 3px;
                `}
              >
                {part.slice(1)}
              </span>
            )
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </div>
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}
      >
        <p
          css={css`
            margin: 0;
            font-size: 14px;
            opacity: 0.7;
          `}
        >
          {attachment.title}
        </p>
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
