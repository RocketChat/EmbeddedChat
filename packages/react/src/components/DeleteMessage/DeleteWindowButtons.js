import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMessageStore, useToastStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';

const DeleteWindowButtons = ({ children, deleteDescription, messageId }) => {
  const [toggleDeleteMessage, setMessageToDelete] = useMessageStore((state) => [
    state.toggleShowDeleteMessage,
    state.setMessageToDelete,
  ]);
  const { RCInstance } = useContext(RCContext);
  const dispatchToastMessage = useToastBarDispatch();
  const toastPosition = useToastStore((state) => state.position);

  const handleOnClose = () => {
    toggleDeleteMessage();
    setMessageToDelete(NaN);
  };

  const handleDeleteMessage = async () => {
    const res = await RCInstance.reportMessage(messageId, deleteDescription);

    if (res.success) {
      dispatchToastMessage({
        type: 'success',
        message: 'Message deleted successfully',
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in deleting message',
      });
    }

    handleOnClose();
  };

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>
          <Icon name="delete" size="1.25rem" /> Delete this message?
        </Modal.Title>
        <Modal.Close onClick={handleOnClose} />
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer>
        <Button color="secondary" onClick={handleOnClose}>
          Cancel
        </Button>
        <Button onClick={handleDeleteMessage} color="error">
          Report message
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
DeleteWindowButtons.propTypes = {
  children: PropTypes.object.isRequired,
  deleteDescription: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
};

export default DeleteWindowButtons;
