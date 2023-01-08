import React from 'react';
import {
  MessageSystem,
  MessageSystemName,
  MessageSystemBody,
  MessageSystemBlock,
} from '@rocket.chat/fuselage';
import { Attachments } from '../Attachments';

const SystemMessage = ({ message }) => (
  // console.log(message);
  <MessageSystem>
    <MessageSystemName>{message.u.username}</MessageSystemName>
    {message.t && (
      <MessageSystemBody
        data-qa-type="system-message-body"
        dangerouslySetInnerHTML={{
          __html: 'Pinned a message',
        }}
      />
    )}
    {message.attachments && (
      <MessageSystemBlock>
        <Attachments attachments={message.attachments} />
      </MessageSystemBlock>
    )}
  </MessageSystem>
);
export default SystemMessage;
