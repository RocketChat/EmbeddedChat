import React from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
import { useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const MentionedMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const { variantOverrides } = useComponentOverrides('MentionedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  return (
    <MessageAggregator
      title={i18n.t('Mentions')}
      iconName="at"
      noMessageInfo={i18n.t('No_Mentions_Found')}
      shouldRender={(msg) =>
        msg.mentions &&
        msg.mentions.some((star) => star._id === authenticatedUserId)
      }
      viewType={viewType}
    />
  );
};

export default MentionedMessages;
