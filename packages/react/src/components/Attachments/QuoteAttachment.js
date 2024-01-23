// import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
// import Attachments from './Attachments';
// import { css } from '@emotion/react';
// import { Box } from '../Box';
// import { Icon } from '../Icon';
// import { ActionButton } from '../ActionButton';
// import { format, isSameDay } from 'date-fns';
// import RCContext from '../../context/RCInstance';

// const quoteStyles = css`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   max-width: 95%;
//   margin: 5px auto 5px auto;
//   padding: 10px;
//   background-color: #f7f8fa;
//   border: 1px;
//   border-color: #d6d8db;
//   border-radius: 5px;

//   .rcx-attachment__details {
//     font-size: 14px;
//     color: #777;
//     display: flex;
//     border: 1px;
//     border-color: #d6d8db;
//   }

//   .rcx-attachment__author {
//     display: flex;
//     align-items: center;
//     margin-bottom: 8px;
//     max-width: 50%;
//   }

//   .rcx-attachment__author-avatar {
//     width: 24px;
//     height: 24px;
//     margin-right: 8px;
//     border-radius: 15%;
//   }

//   .rcx-attachment__author-name {
//     flex-grow: 1;
//     font-size: 16.5px;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     max-width: max-content;
//     margin-right: 10px;
//     color: #93979e;
//   }

//   .rcx-attachment__time {
//     font-size: 12px;
//     color: #777;
//     margin-right: 10px;
//   }

//   .rcx-attachment__content {
//     width: 100%;
//     margin-bottom: 4px;
//   }

//   .rcx-message-body {
//       color: #333;
//       letter-spacing: 0rem;
//       font-size: 0.875rem;
//       font-weight: 400;
//       line-height: 1.25rem;
//       flex-shrink: 1;
//       transition: opacity 0.3s linear;
//       word-break: break-word;
//       opacity: 1;
//       margin-top: 0.125rem;
//       margin-bottom: 0.125rem;
//       margin-block: 0.125rem;
//       max-width: max-content;
//    }
   
//    .rcx-action-button {
//     align-self: flex-end;
    
//     &:hover {
//       background-color: #e4e7ea !important;
//     }
//   }
// `;

// const QuoteAttachment = ({ attachment, onCancel }) => {

//    const { RCInstance } = useContext(RCContext);
//    // console.log(RCContext);
//    // console.log(RCInstance);
//    let host = RCInstance.getHost();

//    console.log(attachment);
//    // console.log(host);

//    const formatTime = (timestamp) => {
//       console.log('Timestamp: ', timestamp);
//       const messageDate = new Date(timestamp);
//       const currentDate = new Date();

//       console.log(messageDate + '/' + currentDate);

//       if (isSameDay(messageDate, currentDate)) {
//          return format(messageDate, 'hh:mm a');
//       } else {
//          return format(messageDate, 'MMMM dd, yyyy');
//       }
//    };

//    return (
//       <Box css={quoteStyles}>
//          <Box className="rcx-attachment__details">
//             <Box className="rcx-attachment__content">
//                <Box className="rcx-attachment__author">
//                   {!!attachment.author_icon && (
//                      <Box
//                         className="rcx-attachment__author-avatar"
//                         is="img"
//                         src={`${host}${attachment.author_icon}`}
//                      />
//                   )}
//                   <Box className="rcx-attachment__author-name">
//                      <b>{attachment.author_name}</b>
//                   </Box>
//                   {!!attachment.ts && (
//                      <Box className="rcx-attachment__time">
//                         {formatTime(attachment.ts)}
//                      </Box>
//                   )}
//                </Box>
//                <Box>
//                   <Box className="rcx-message-body">{attachment.text}</Box>
//                </Box>
//                {!!attachment.attachments && (
//                   <Box className="rcx-attachment__content">
//                      <Attachments attachments={attachment.attachments} />
//                   </Box>
//                )}
//             </Box>
//             {!!onCancel && (
//                <Box>
//                   <ActionButton
//                      ghost
//                      className="rcx-action-button"
//                      size="small"
//                      onClick={onCancel}
//                   >
//                      <Icon name="cross" size="15px" />
//                   </ActionButton>
//                </Box>
//             )}
//          </Box>
//       </Box>
//    );
// };

// QuoteAttachment.propTypes = {
//    attachment: PropTypes.shape({
//       author_icon: PropTypes.string,
//       author_link: PropTypes.string,
//       author_name: PropTypes.string,
//       ts: PropTypes.number,
//       md: PropTypes.string,
//       text: PropTypes.string,
//       attachments: PropTypes.array,
//       collapsed: PropTypes.bool,
//    }),
// };

// export default QuoteAttachment;
