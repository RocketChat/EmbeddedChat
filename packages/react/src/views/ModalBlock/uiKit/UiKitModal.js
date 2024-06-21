/* eslint-disable no-void */
import React from 'react';
import { useEffectEvent } from '@rocket.chat/fuselage-hooks';
import { UiKitContext } from '../../../uiKit';
import { useModalContextValue } from '../../../hooks/uiKit/useModalBlockContextValue';
import ModalBlock from './ModalBlock';
import useUiKitView from '../../../hooks/uiKit/useUiKitView';
import useUiKitActionManager from '../../../hooks/uiKit/useUiKitActionManager';

const UiKitModal = ({ initialView }) => {
  const { view, errors, values, updateValues, state } =
    useUiKitView(initialView);
  const contextValue = useModalContextValue({
    view,
    values,
    updateValues,
  });

  const actionManager = useUiKitActionManager();

  const handleSubmit = useEffectEvent(
    (e) => {
      e.preventDefault();
      void actionManager.emitInteraction(view.appId, {
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
    [actionManager, view, state]
  );

  const handleCancel = useEffectEvent(
    (e) => {
      e.preventDefault();
      void actionManager.emitInteraction(view.appId, {
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
    [actionManager, view, state]
  );

  const handleClose = useEffectEvent(() => {
    void actionManager.emitInteraction(view.appId, {
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
  }, [actionManager, view, state]);

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
