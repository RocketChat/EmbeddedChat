import React from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const MentionedMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const username = useUserStore((state) => state.username);
  const { variantOverrides } = useComponentOverrides('MentionedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const hasMention = (msg) => {
    if (!msg.attachments?.length) {
      return false;
    }

    return msg.attachments.some((attachment) =>
      attachment.descriptionMd?.some((desc) =>
        desc.value?.some(
          (val) => val.type === 'MENTION_USER' && val.value.value === username
        )
      )
    );
  };

  return (
    <MessageAggregator
      title="Mentions"
      iconName="at"
      noMessageInfo="No mentions found"
      shouldRender={(msg) =>
        (msg.mentions &&
          msg.mentions.some((star) => star._id === authenticatedUserId)) ||
        hasMention(msg)
      }
      viewType={viewType}
    />
  );
};

export default MentionedMessages;
