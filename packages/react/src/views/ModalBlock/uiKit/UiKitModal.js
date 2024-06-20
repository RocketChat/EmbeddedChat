/* eslint-disable no-void */
import React, { useContext, useCallback } from 'react';
import { UiKitContext } from '../../../uiKit';
import RCContext from '../../../context/RCInstance';

import { useModalContextValue } from '../../../hooks/uiKit/useModalBlockContextValue';
import { useUiKitView } from '../../../hooks/uiKit/useUiKitView';
import ModalBlock from './ModalBlock';

const UiKitModal = ({ initialView }) => {
  console.log(initialView);
  const { RCInstance } = useContext(RCContext);
  const { view, errors, values, updateValues, state } =
    useUiKitView(initialView);
  const contextValue = useModalContextValue({ view, values, updateValues });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await RCInstance?.triggerBlockAction({
        appId: view.appId,
        type: 'viewSubmit',
        payload: {
          view: {
            ...view,
            state,
          },
        },
        viewId: view.id,
      });
    },
    [RCInstance, state, view]
  );

  const handleCancel = useCallback(
    async (e) => {
      e.preventDefault();
      await RCInstance?.triggerBlockAction({
        appId: view.appId,
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
    },
    [RCInstance, state, view]
  );

  const handleClose = useCallback(async () => {
    await RCInstance?.triggerBlockAction({
      appId: view.appId,
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
  }, [RCInstance, state, view]);

  return (
    <UiKitContext.Provider value={contextValue}>
      <ModalBlock
        view={view}
        errors={errors}
        appId={view.appId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onClose={handleClose}
      />
    </UiKitContext.Provider>
  );
};

export default UiKitModal;
