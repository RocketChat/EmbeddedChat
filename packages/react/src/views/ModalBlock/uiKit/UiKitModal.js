/* eslint-disable no-void */
import React, { useContext, useCallback } from 'react';
import { UiKitContext } from '../../../uiKit';
import RCContext from '../../../context/RCInstance';
import { useModalContextValue } from '../../../hooks/uiKit/useModalBlockContextValue';
import ModalBlock from './ModalBlock';
import useUiKitView from '../../../hooks/uiKit/useUiKitView';

const UiKitModal = ({ initialView }) => {
  const { RCInstance } = useContext(RCContext);
  const { view, errors, values, updateValues, state } =
    useUiKitView(initialView);
  const contextValue = useModalContextValue({
    view,
    values,
    updateValues,
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await RCInstance?.handleUiKitInteraction(view.appId, {
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
    [RCInstance, view, state]
  );

  const handleCancel = useCallback(
    async (e) => {
      e.preventDefault();
      await RCInstance?.handleUiKitInteraction(view.appId, {
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
    [RCInstance, view, state]
  );

  const handleClose = useCallback(async () => {
    await RCInstance?.handleUiKitInteraction(view.appId, {
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
  }, [RCInstance, view, state]);

  return (
    <UiKitContext.Provider value={contextValue}>
      <ModalBlock
        view={view}
        errors={errors}
        appId={initialView.appId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onClose={handleClose}
      />
    </UiKitContext.Provider>
  );
};

export default UiKitModal;
