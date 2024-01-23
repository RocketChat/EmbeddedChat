import React from 'react';
import PropTypes from 'prop-types';
import Attachments from './Attachment';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { css } from '@emotion/react';

const quoteStyles = css`
  display: block;
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 16px;
  background-color: #f5f5f5;
  border-left: 4px solid #3498db;

  &:hover,
  &:focus {
    background-color: #ecf0f1;
  }

  .rcx-attachment__details {
    font-size: 14px;
    color: #777;

    .rcx-message-body {
      color: #333;
      letter-spacing: 0rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25rem;
      flex-shrink: 1;
      transition: opacity 0.3s linear;
      word-break: break-word;
      opacity: 1;
      margin-top: 0.125rem;
      margin-bottom: 0.125rem;
      margin-block: 0.125rem;
    }
  }

  .rcx-attachment__author {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .rcx-attachment__author-avatar {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 50%;
  }

  .rcx-attachment__author-name {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rcx-attachment__time {
    font-size: 12px;
    color: #777;
  }

  .rcx-attachment__content {
    width: 100%;
    margin-bottom: 4px;
  }
`;

const QuoteAttachment = ({ attachment, onCancel }) => {
   const formatTime = (time) => String(time);

   return (
      <Box>
         <Box className={quoteStyles}>
            <Box className="rcx-attachment__details" is='blockquote'>
               <Box className="rcx-attachment__author">
                  {attachment.author_icon && (
                     <Box className="rcx-attachment__author-avatar" is='img' src={attachment.author_icon} />
                  )}
                  <Box className="rcx-attachment__author-name" flexGrow={1}>
                     {attachment.author_name}
                  </Box>
                  {attachment.ts && (
                     <Box className="rcx-attachment__time" fontScale='c1' color='hint'>
                        {formatTime(attachment.ts)}
                     </Box>
                  )}
               </Box>
               {/* Placeholder for MessageBodyContainer */}
               <Box className="rcx-message-body-container">
                  {/* Placeholder for MessageBody */}
                  <Box className="rcx-message-body">{attachment.md || attachment.text}</Box>
               </Box>
               {attachment.attachments && (
                  <Box className="rcx-attachment__content">
                     <Attachments attachments={attachment.attachments} collapsed={attachment.collapsed} />
                  </Box>
               )}
            </Box>
            <p>
               {/* Additional content or controls */}
               <button onClick={onCancel}>
                  {/* Example: Close button */}
                  <Icon name="close" size="20px" />
               </button>
            </p>
         </Box>
      </Box>
   );
};

QuoteAttachment.propTypes = {
   attachments: PropTypes.arrayOf(
      PropTypes.shape({
         author_icon: PropTypes.string,
         author_link: PropTypes.string,
         author_name: PropTypes.string,
         ts: PropTypes.number,
         md: PropTypes.string,
         text: PropTypes.string,
         attachments: PropTypes.array,
         collapsed: PropTypes.bool,
      })
   ),
};

export default QuoteAttachment;
