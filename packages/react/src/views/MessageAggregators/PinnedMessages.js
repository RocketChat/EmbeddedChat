import React from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
import { MessageAggregator } from './common/MessageAggregator';

const PinnedMessages = () => {
  const { variantOverrides } = useComponentOverrides('PinnedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  return (
    <MessageAggregator
      title={i18n.t('Pinned_Messages')}
      iconName="pin"
      noMessageInfo={i18n.t('No_Pinned_Messages')}
      shouldRender={(msg) => msg.pinned}
      viewType={viewType}
    />
  );
};

export default PinnedMessages;
