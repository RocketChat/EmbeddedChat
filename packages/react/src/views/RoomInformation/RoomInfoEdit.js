import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Input,
  Button,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';

const RoomInfoEdit = ({ channelInfo, onSave }) => {
  const Instance = useContext(RCContext);
  const dispatchToastMessage = useToastBarDispatch();
  const [name, setName] = useState(channelInfo.name);
  const [topic, setTopic] = useState(channelInfo.topic);
  const [announcement, setAnnouncement] = useState(channelInfo.announcement);
  const [description, setDescription] = useState(channelInfo.description);

  const handleSave = async () => {
    if (!name.trim()) {
      dispatchToastMessage({
        type: 'error',
        message: 'Room name is required',
      });
      return;
    }
    const updatedChannelInfo = {
      name,
      topic,
      announcement,
      description,
    };
    try {
      await Instance.RCInstance.setRoomInfo(updatedChannelInfo);
      onSave(updatedChannelInfo);
      dispatchToastMessage({
        type: 'success',
        message: 'Room information updated successfully',
      });
    } catch (error) {
      console.error('Error updating room info:', error);
    }
  };

  return (
    <Box
      css={css`
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      <Box
        css={css`
          font-weight: 900;
        `}
      >
        Name
      </Box>
      <Input value={name} onChange={(e) => setName(e.target.value)} />

      <Box
        css={css`
          font-weight: 900;
        `}
      >
        Topic
      </Box>
      <Input value={topic} onChange={(e) => setTopic(e.target.value)} />

      <Box
        css={css`
          font-weight: 900;
        `}
      >
        Announcement
      </Box>
      <Input
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
      />

      <Box
        css={css`
          font-weight: 900;
        `}
      >
        Description
      </Box>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button
        onClick={handleSave}
        style={{
          position: 'sticky',
          backgroundColor: '#156ff5',
          fontWeight: '600',
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default RoomInfoEdit;
