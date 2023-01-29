import React from 'react';
import { ModalBackdrop } from '@rocket.chat/fuselage';
import GenericModal from './GenericModal';
// eslint-disable-next-line arrow-body-style
const MessageReportWindow = () => {
  return (
    <ModalBackdrop>
      <GenericModal
        variant="danger"
        title="Report_this_message_question_mark"
        onClose={NaN}
        onCancel={NaN}
        onConfirm={NaN}
        confirmText="Report_exclamation_mark"
      >
        Heyy
      </GenericModal>
    </ModalBackdrop>
  );
};

export default MessageReportWindow;
