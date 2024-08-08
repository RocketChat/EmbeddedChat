import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import { MessageBody } from './MessageBody';
import { MessageToolbox } from './MessageToolbox';
import { MessageDivider } from './MessageDivider';
import MessageAvatarContainer from './MessageAvatarContainer';
import MessageBodyContainer from './MessageBodyContainer';
import { getMessageStyles } from './Message.styles';
import useBubbleStyles from './BubbleVariant/useBubbleStyles';
import useLayoutStore from '../../store/layoutStore';

const Message = ({
  message,
  sequential = false,
  lastSequential = false,
  newDay = false,
  variantOverrides = 'default',
}) => {
  const isMe = message.u.username === 'spiral_memory';
  const styles = getMessageStyles(useTheme());
  const bubbleStyles = useBubbleStyles(isMe);
  const shouldShowHeader = !sequential;
  const messageView = useLayoutStore((state) => state.messageView);
  const finalVariant = messageView || variantOverrides;
  const variantStyles = finalVariant === 'bubble' ? bubbleStyles : {};

  return (
    <>
      <Box
        className="ec-message"
        css={[
          variantStyles.messageParent || styles.main,
          message._id === '62vhmKJGNoxgvLL7M' &&
            variantOverrides === 'flat' &&
            styles.specialMessage,
        ]}
      >
        <MessageAvatarContainer message={message} sequential={sequential} />

        <MessageBodyContainer variantStyles={variantStyles}>
          {shouldShowHeader && (
            <MessageHeader
              message={message}
              {...(variantStyles?.name?.includes('bubble') && {
                showDisplayName: !isMe,
              })}
            />
          )}

          {!message.t ? (
            <>
              <MessageBody
                className="ec-message-body"
                id={`ec-message-body-${message._id}`}
                css={message.isPending && styles.pendingMessageBody}
                variantStyles={variantStyles}
                isText={!!message.md}
                sequential={sequential}
                lastSequential={lastSequential}
              >
                <Markdown body={message} isReaction={false} />

                {!message.t && message._id === '62vhmKJGNoxgvLL7M' ? (
                  <MessageToolbox variantStyles={variantStyles} />
                ) : (
                  <></>
                )}
              </MessageBody>
            </>
          ) : null}
        </MessageBodyContainer>
      </Box>
      {newDay && (
        <MessageDivider>
          {format(new Date(message.ts), 'MMMM d, yyyy')}
        </MessageDivider>
      )}
    </>
  );
};
Message.propTypes = {
  message: PropTypes.any,
  sequential: PropTypes.bool,
  newDay: PropTypes.bool,
  type: PropTypes.oneOf(['thread', 'default']),
  showAvatar: PropTypes.bool,
};

export default Message;
