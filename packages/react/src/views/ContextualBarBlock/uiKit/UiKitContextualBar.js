/* eslint-disable no-void */
import { useEffectEvent } from '@rocket.chat/fuselage-hooks';
import { css } from '@emotion/react';
import { BlockContext } from '@rocket.chat/ui-kit';
import React, { memo, useContext } from 'react';
import {
  UiKitComponent,
  UiKitContextualBar as UiKitContextualBarSurfaceRender,
  contextualBarParser,
  UiKitContext,
} from '@embeddedchat/ui-kit';
import {
  Button,
  MinimalSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@embeddedchat/ui-elements';

import useContextualBarContextValue from '../../../hooks/uiKit/useContextualBarContextValue';
import useUiKitActionManager from '../../../hooks/uiKit/useUiKitActionManager';
import useUiKitView from '../../../hooks/uiKit/useUiKitView';
import RCContext from '../../../context/RCInstance';

const UiKitContextualBar = ({ initialView }) => {
  const { RCInstance } = useContext(RCContext);
  const getHost = () => {
    const host = RCInstance.getHost();
    return host;
  };
  const { emitInteraction } = useUiKitActionManager();
  const { view, values, updateValues, state } = useUiKitView(initialView);
  const contextValue = useContextualBarContextValue({
    view,
    values,
    updateValues,
  });

  const handleSubmit = useEffectEvent((e) => {
    e.preventDefault();
    void emitInteraction(view.appId, {
      type: 'viewSubmit',
      payload: {
        view: {
          ...view,
          state,
        },
      },
      viewId: view.id,
    });
  });

  const handleCancel = useEffectEvent((e) => {
    e.preventDefault();
    void emitInteraction(view.appId, {
      type: 'viewClosed',
      payload: {
        viewId: view.id,
        view: {
          ...view,
          state,
        },
        isCleared: false,
      },
    });
  });

  const handleClose = useEffectEvent((e) => {
    e.preventDefault();
    void emitInteraction(view.appId, {
      type: 'viewClosed',
      payload: {
        viewId: view.id,
        view: {
          ...view,
          state,
        },
        isCleared: true,
      },
    });
  });

  return (
    <UiKitContext.Provider value={contextValue}>
      <MinimalSidebar>
        <SidebarHeader
          title={contextualBarParser.text(view.title, BlockContext.NONE, 0)}
          onClose={handleClose}
          avatarUrl={`${getHost()}/api/apps/${view.appId}/icon`}
        />
        <SidebarContent
          style={{
            padding: '0.75rem',
            height: '90%',
          }}
        >
          <form method="post" action="#" onSubmit={handleSubmit}>
            <UiKitComponent
              render={UiKitContextualBarSurfaceRender}
              blocks={view.blocks}
            />
          </form>
        </SidebarContent>
        <SidebarFooter
          css={css`
            margin: 0.75rem;
            display: flex;
          `}
        >
          {view.close && (
            <Button
              type={view.close.style === 'danger' ? 'destructive' : 'secondary'}
              onClick={handleCancel}
              style={{ flex: 1 }}
            >
              {contextualBarParser.text(view.close.text)}
            </Button>
          )}
          {view.submit && (
            <Button
              type={view.submit?.style === 'danger' ? 'destructive' : 'primary'}
              style={{ flex: 1, marginLeft: '0.75rem' }}
              onClick={handleSubmit}
            >
              {contextualBarParser.text(view.submit.text)}
            </Button>
          )}
        </SidebarFooter>
      </MinimalSidebar>
    </UiKitContext.Provider>
  );
};

export default memo(UiKitContextualBar);
