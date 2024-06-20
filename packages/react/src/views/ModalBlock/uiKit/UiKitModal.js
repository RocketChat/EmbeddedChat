/* eslint-disable no-void */
import React, { useContext, useCallback } from 'react';
import { UiKitContext } from '../../../uiKit';
import RCContext from '../../../context/RCInstance';

import { useModalContextValue } from '../../../hooks/uiKit/useModalBlockContextValue';
import { useUiKitView } from '../../../hooks/uiKit/useUiKitView';
import ModalBlock from './ModalBlock';

const UiKitModal = ({ initialView }) => {
  const { RCInstance } = useContext(RCContext);
  const { values, updateValues, state } = useUiKitView(initialView);
  const contextValue = useModalContextValue({
    view: initialView,
    values,
    updateValues,
  });
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await RCInstance?.triggerBlockAction({
        appId: initialView.appId,
        type: 'viewSubmit',
        payload: {
          view: {
            ...initialView,
            state,
          },
        },
        viewId: initialView.id,
      });
    },
    [RCInstance, state, initialView]
  );

  const handleCancel = useCallback(
    async (e) => {
      e.preventDefault();
      await RCInstance?.triggerBlockAction({
        appId: initialView.appId,
        type: 'viewClosed',
        payload: {
          viewId: initialView.id,
          view: {
            ...initialView,
            state,
          },
          isCleared: false,
        },
      });
    },
    [RCInstance, state, initialView]
  );

  const handleClose = useCallback(async () => {
    await RCInstance?.triggerBlockAction({
      appId: initialView.appId,
      type: 'viewClosed',
      payload: {
        viewId: initialView.id,
        view: {
          ...initialView,
          state,
        },
        isCleared: true,
      },
    });
  }, [RCInstance, state, initialView]);

  return (
    <UiKitContext.Provider value={contextValue}>
      <ModalBlock
        view={initialView}
        appId={initialView.appId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onClose={handleClose}
      />
    </UiKitContext.Provider>
  );
};

export default UiKitModal;
