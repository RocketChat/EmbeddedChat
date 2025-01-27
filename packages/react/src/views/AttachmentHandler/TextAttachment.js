import React, { useContext, useMemo } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import { format } from 'date-fns';
import RCContext from '../../context/RCInstance';
import { Markdown } from '../Markdown';

const TextAttachment = ({ attachment, type, variantStyles = {} }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (authorIcon) => {
    const host = RCInstance.getHost();
    const URL = `${host}${authorIcon}`;
    return URL;
  };

  const { theme } = useTheme();

  const formattedTimestamp = useMemo(() => {
    let timestamp;
    if (typeof attachment.ts === 'object') {
      timestamp = attachment.ts.$date;
    } else if (typeof attachment.ts === 'string') {
      timestamp = new Date(attachment.ts).getTime();
    }
    const formattedTime = format(new Date(timestamp), 'h:mm a');
    return formattedTime;
  }, [attachment.ts]);

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
            <Box
              is="span"
              css={css`
                color: ${theme.colors.accentForeground};
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                letter-spacing: 0rem;
                font-size: 0.7rem;
                font-weight: 400;
                line-height: 1rem;
                flex-shrink: 0;
                margin-left: 0.25rem;
              `}
            >
              {formattedTimestamp}
            </Box>
          </>
        )}
      </Box>
      <Box
        css={css`
          margin-top: 0.5rem;
          white-space: pre-line;
        `}
      >
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
                  margin-top: 0rem;
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
                    <Avatar
                      url={getUserAvatarUrl(nestedAttachment?.author_icon)}
                      alt="avatar"
                      size="1.2em"
                    />
                    <Box>@{nestedAttachment?.author_name}</Box>
                    <Box
                      is="span"
                      css={css`
                        color: ${theme.colors.accentForeground};
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        letter-spacing: 0rem;
                        font-size: 0.7rem;
                        font-weight: 400;
                        line-height: 1rem;
                        flex-shrink: 0;
                        margin-left: 0.25rem;
                      `}
                    >
                      {formattedTimestamp}
                    </Box>
                  </>
                )}
              </Box>
              <Box
                css={css`
                  margin-top: 0.5rem;
                  white-space: pre-line;
                `}
              >
                {nestedAttachment?.text ? (
                  nestedAttachment.text[0] === '[' ? (
                    nestedAttachment.text.match(/\n(.*)/)?.[1] || ''
                  ) : (
                    <Markdown
                      body={nestedAttachment.text}
                      md={nestedAttachment.md}
                      isReaction={false}
                    />
                  )
                ) : (
                  ''
                )}
              </Box>
            </Box>
          ))}
        {attachment?.text ? (
          attachment.text[0] === '[' ? (
            attachment.text.match(/\n(.*)/)?.[1] || ''
          ) : (
            <Markdown
              body={attachment.text}
              md={attachment.md}
              isReaction={false}
            />
          )
        ) : (
          ''
        )}
      </Box>
    </Box>
  );
};

export default TextAttachment;

TextAttachment.propTypes = {
  attachment: PropTypes.object,
};
