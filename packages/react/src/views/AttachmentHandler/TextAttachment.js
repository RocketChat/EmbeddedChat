import React, { useContext } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';

const TextAttachment = ({ attachment, type, variantStyles = {} }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (authorIcon) => {
    const host = RCInstance.getHost();
    const URL = `${host}${authorIcon}`;
    return URL;
  };

  let attachmentText = attachment?.text;
  if (attachmentText.includes(')')) {
    attachmentText = attachmentText.split(')')[1] || '';
  }

  const { theme } = useTheme();

  return (
    <Box
      css={[
        css`
          display: flex;
          flex-direction: column;
          letter-spacing: 0rem;
          font-size: 0.875rem;
          font-weight: 400;
          word-break: break-word;
          border-inline-start: 3px solid ${theme.colors.border};
          margin-top: 0.75rem;
          padding: 0.5rem;
        `,
        (type ? variantStyles.pinnedContainer : variantStyles.quoteContainer) ||
          css`
            ${!type ? `border: 3px solid ${theme.colors.border};` : ''}
          `,
      ]}
    >
      <Box
        css={[
          css`
            display: flex;
            gap: 0.3rem;
            align-items: center;
          `,

          variantStyles.textUserInfo,
        ]}
      >
        {attachment?.author_name && (
          <>
            <Avatar
              url={getUserAvatarUrl(attachment?.author_icon)}
              alt="avatar"
              size="1.2em"
            />
            <Box>@{attachment?.author_name}</Box>
          </>
        )}
      </Box>
      <Box
        css={css`
          margin-top: 0.5rem;
          white-space: pre-line;
        `}
      >
        {attachment?.text
          ? attachment.text[0] === '['
            ? attachment.text.match(/\n(.*)/)[1]
            : attachment.text
          : ''}
        {attachment?.attachments && attachment.attachments.length > 0 ? (
          <Box
            css={[
              css`
                display: flex;
                flex-direction: column;
                letter-spacing: 0rem;
                font-size: 0.875rem;
                font-weight: 400;
                word-break: break-word;
                border-inline-start: 3px solid ${theme.colors.border};
                margin-top: 0.75rem;
                padding: 0.5rem;
              `,
              (attachment.attachments[0]?.type
                ? variantStyles.pinnedContainer
                : '') ||
                css`
                  ${!attachment.attachments[0]?.type
                    ? `border: 2px solid ${theme.colors.border};`
                    : ''}
                `,
              css`
                ${variantStyles.name !== undefined &&
                variantStyles.name.includes('bubble')
                  ? `border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem`
                  : ''}
              `,
            ]}
          >
            <Box
              css={[
                css`
                  display: flex;
                  gap: 0.3rem;
                  align-items: center;
                `,

                variantStyles.textUserInfo,
              ]}
            >
              {attachment.attachments[0]?.author_name && (
                <>
                  <Avatar
                    url={getUserAvatarUrl(
                      attachment.attachments[0]?.author_icon
                    )}
                    alt="avatar"
                    size="1.2em"
                  />
                  <Box>@{attachment.attachments[0]?.author_name}</Box>
                </>
              )}
            </Box>
            <Box
              css={css`
                margin-top: 0.5rem;
                white-space: pre-line;
              `}
            >
              {attachment.attachments[0]?.text
                ? attachment.attachments[0].text[0] === '['
                  ? attachment.attachments[0].text.match(/\n(.*)/)[1]
                  : attachment.attachments[0].text
                : ''}
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default TextAttachment;

TextAttachment.propTypes = {
  attachment: PropTypes.object,
};
