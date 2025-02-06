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
    let date;

    if (typeof attachment.ts === 'object') {
      timestamp = attachment.ts.$date;
      return format(new Date(timestamp), 'h:mm a');
    }
    if (typeof attachment.ts === 'string') {
      date = new Date(attachment.ts);
      const now = new Date();

      const isSameDay =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const isSameWeek = (() => {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return date >= startOfWeek && date <= endOfWeek;
      })();

      const isSameMonth =
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const isSameYear = date.getFullYear() === now.getFullYear();

      switch (true) {
        case isSameDay:
          return format(date, 'h:mm a');
        case isSameWeek:
          return format(date, 'EEEE, h:mm a');
        case isSameMonth:
          return format(date, 'dd/MM/yyyy');
        case isSameYear:
          return format(date, 'MMMM d, yyyy');
        default:
          return format(date, 'MMMM d, yyyy');
      }
    }
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
                text-decoration: underline;

                @media (max-width: 380px) {
                  font-size: 0.6rem;
                  display: block;
                }
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
                        text-decoraction: underline;
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
