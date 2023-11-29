import React from 'react';
import PropTypes from 'prop-types';
import { useMessageStore } from '../../store';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';

const DeleteWindowButtons = ({ children, messageId }) => {
  const [toggleDeleteMessage, setMessageToDelete] = useMessageStore((state) => [
    state.toggleShowDeleteMessage,
    state.setMessageToDelete,
  ]);
  const dispatchToastMessage = useToastBarDispatch();

  const handleOnClose = () => {
    toggleDeleteMessage();
    setMessageToDelete(null);
  };

  const handleDeleteMessage = async () => {
    // Add logic to delete the message
    const res = await RCInstance.deleteMessage(messageId);

    //  // Example logic for success and error messages
    //  const res = { success: true }; // Replace with actual logic

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
      <hr />
      <Modal.Footer>
        <Button color="secondary" onClick={handleOnClose}>
          Cancel
        </Button>
        <Button onClick={handleDeleteMessage} color="error">
          Delete message
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeleteWindowButtons.propTypes = {
  children: PropTypes.object.isRequired,
  messageId: PropTypes.string.isRequired,
};

export default DeleteWindowButtons;
