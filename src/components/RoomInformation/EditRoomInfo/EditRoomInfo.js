import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Icon,
  ActionButton,
  Avatar,
  Button,
  Input,
  Label,
  TextAreaInput,
  ToggleSwitch,
} from '@rocket.chat/fuselage';
import RCContext from '../../../context/RCInstance';
import classes from '../RoomInformation.module.css';
import { useChannelStore } from '../../../store';

const EditRoominfo = () => {
  const { RCInstance } = useContext(RCContext);

  const host = RCInstance.getHost();

  const channelInfo = useChannelStore((state) => state.channelInfo);
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);
  const toggleEditChannel = useChannelStore((state) => state.toggleEditChannel);

  const [previewUrl, setPreviewUrl] = useState(`${channelInfo.avatarETag}`);

  const [name, setName] = useState(channelInfo.name);
  const [description, setDescription] = useState(channelInfo.description ?? '');
  const [privateMode, setPrivate] = useState(channelInfo.roomType === 'p');
  const [readOnly, setReadOnly] = useState(channelInfo.ro);
  const [archive, setArchive] = useState(channelInfo.archived);

  const getChannelAvatarURL = (channelname) => `${host}/avatar/${channelname}`;

  useEffect(() => {
    if (!`${previewUrl}`.startsWith('data')) {
      setPreviewUrl(`${host}/avatar/${name.length > 0 ? name : 'general'}`);
    }
  });

  const handleReset = () => {
    setName(channelInfo.name);
    setDescription(channelInfo.description);
    setPrivate(channelInfo.roomType === 'p');
    setPreviewUrl(`${channelInfo.avatarETag}`);
    setReadOnly(channelInfo.ro);
    setArchive(channelInfo.archived);
  };

  const handleImage = (data) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(data);
  };

  const handleSave = async () => {
    const data = {
      roomName: name,
      roomDescription: description,
      roomType: privateMode ? 'p' : 'c',
      readOnly,
    };
    if (previewUrl.startsWith(host)) {
      data.roomAvatar = null;
    } else if (previewUrl.startsWith('data')) {
      data.roomAvatar = previewUrl;
    }

    if (channelInfo.archived !== archive)
      await RCInstance.changeArchivationState(archive);
    await RCInstance.saveRoomInfo(data);

    setChannelInfo({
      avatarETag: previewUrl,
      t: privateMode ? 'p' : 'c',
      name,
      description,
      ro: readOnly,
      archived: archive,
    });
  };

  return (
    <Box className={classes.component} p="x16">
      <Box className={classes.editRoomHeader} display="flex" is="h3">
        <Icon name="info" size="x24" padding="0px 20px 20px 0px" />
        <Box width="80%" style={{ color: '#4a4a4a' }}>
          Edit Room
        </Box>
        <ActionButton
          onClick={toggleEditChannel}
          ghost
          display="inline"
          square
          small
        >
          <Icon name="back" size="x20" />
        </ActionButton>
      </Box>
      <Box
        style={{ marginTop: '50px' }}
        display="flex"
        flexDirection="column"
        is="h3"
      >
        <Box style={{ position: 'relative' }}>
          <Avatar
            size="x332"
            url={
              previewUrl.startsWith('data') || previewUrl.startsWith(host)
                ? previewUrl
                : getChannelAvatarURL(
                    `${channelInfo._id}?etag=${channelInfo.avatarETag}`
                  )
            }
          />
          <Box
            style={{
              top: '300px',
              right: '7px',
              position: 'absolute',
              zIndex: '110',
            }}
          >
            <Label
              className="rcx-box rcx-box--full rcx-box--animated rcx-button"
              htmlFor="avatar-input"
            >
              <Icon name="cloud-arrow-up" />
              Upload
              <Input
                accept="image/*"
                onChange={(e) => {
                  handleImage(e.target.files[0]);
                }}
                id="avatar-input"
                display="none"
                type="file"
              />
            </Label>
            <Button
              onClick={async () => {
                setPreviewUrl(`${host}/avatar/${channelInfo.name}`);
              }}
              style={{ marginLeft: '5px' }}
              danger
            >
              <Icon name="trash" />
            </Button>
          </Box>
        </Box>
        <Box
          style={{ marginTop: '10px' }}
          width="100%"
          flexDirection="column"
          display="flex"
        >
          <Label>Name</Label>
          <Input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </Box>
        <Box
          style={{ marginTop: '10px' }}
          width="100%"
          flexDirection="column"
          display="flex"
        >
          <Label>Description</Label>
          <TextAreaInput
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows={4}
            cols={1}
            value={description}
          />
        </Box>
        <Box display="flex" flexDirection="column">
          <Box className={classes.toggle}>
            <Label>Private</Label>
            <ToggleSwitch
              onChange={() => {
                setPrivate((i) => !i);
              }}
              checked={privateMode}
            />
          </Box>
          <span className={classes.toggleLabel}>
            Only invited people can join
          </span>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box className={classes.toggle}>
            <Label>Read Only</Label>
            <ToggleSwitch
              onChange={() => {
                setReadOnly((i) => !i);
              }}
              checked={readOnly}
            />
          </Box>
          <span className={classes.toggleLabel}>
            Only authorized users can write new messages
          </span>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box className={classes.toggle}>
            <Label>Archived</Label>
            <ToggleSwitch
              onChange={() => {
                setArchive((i) => !i);
              }}
              checked={archive}
            />
          </Box>
        </Box>
        <Box style={{ marginTop: '10px' }} display="flex">
          <Button
            onClick={handleReset}
            style={{ width: '100%', marginRight: '5px' }}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            style={{ width: '100%', marginLeft: '5px' }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default EditRoominfo;
