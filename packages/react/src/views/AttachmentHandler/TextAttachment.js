import React, { useContext } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';

const TextAttachment = ({ attachment, type, variantStyles = {} }) => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const hideAvatar = ECOptions?.showAvatar === false;
  const getUserAvatarUrl = (authorIcon) => {
    const host = RCInstance.getHost();
    const URL = `${host}${authorIcon}`;
    return URL;
  };

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
            {!hideAvatar && (
              <Avatar
                url={getUserAvatarUrl(attachment?.author_icon)}
                alt="avatar"
                size="1.2em"
              />
            )}
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
            ? attachment.text.match(/\n(.*)/)?.[1] || ''
            : attachment.text
          : ''}
        {attachment?.attachments &&
          attachment.attachments.map((nestedAttachment, index) => (
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
                (nestedAttachment?.type ? variantStyles.pinnedContainer : '') ||
                  css`
                    ${!attachment?.type
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
              key={index}
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
                {nestedAttachment?.author_name && (
                  <>
                    {!hideAvatar && (
                      <Avatar
                        url={getUserAvatarUrl(nestedAttachment?.author_icon)}
                        alt="avatar"
                        size="1.2em"
                      />
                    )}
                    <Box>@{nestedAttachment?.author_name}</Box>
                  </>
                )}
              </Box>
              <Box
                css={css`
                  margin-top: 0.5rem;
                  white-space: pre-line;
                `}
              >
                {nestedAttachment?.text
                  ? nestedAttachment.text[0] === '['
                    ? nestedAttachment.text.match(/\n(.*)/)?.[1] || ''
                    : nestedAttachment.text
                  : ''}
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default TextAttachment;

TextAttachment.propTypes = {
  attachment: PropTypes.object,
};
