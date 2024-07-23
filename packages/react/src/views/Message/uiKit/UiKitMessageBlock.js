import React from 'react';
import {
  UiKitComponent,
  UiKitContext,
  UiKitMessage,
} from '@embeddedchat/ui-kit';
import { useMessageBlockContextValue } from '../../../hooks/uiKit/useMessageBlockContextValue';

const UiKitMessageBlock = ({ rid, mid, blocks }) => {
  const contextValue = useMessageBlockContextValue(rid, mid);

  return (
    <UiKitContext.Provider value={contextValue} mid={mid}>
      <UiKitComponent render={UiKitMessage} blocks={blocks} />
    </UiKitContext.Provider>
  );
};

export default UiKitMessageBlock;
