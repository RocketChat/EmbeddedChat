import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Avatar,
  Sidebar,
  Popup,
  Button,
  useComponentOverrides,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useChannelStore, useUserStore } from '../../store';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import { getRoomStyles } from './RoomInformation.styles';
import RoomInfoEdit from './RoomInfoEdit';

const RoomInformation = () => {
  const { RCInstance } = useContext(RCContext);
  const styles = getRoomStyles();
  const { channelInfo, setChannelInfo, editRoomInfoPermission } =
    useChannelStore();
  const editRoles = new Set(editRoomInfoPermission);
  const { variantOverrides } = useComponentOverrides('RoomMember');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const setExclusiveState = useSetExclusiveState();
  const [isEditing, setIsEditing] = useState(false);
  const userRoles = useUserStore((state) => state.roles);
  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  const handleSave = (updatedChannelInfo) => {
    const updatedInfo = {
      ...channelInfo,
      name: updatedChannelInfo.name,
      description: updatedChannelInfo.description,
      announcement: updatedChannelInfo.announcement,
      topic: updatedChannelInfo.topic,
    };
    setChannelInfo(updatedInfo);
    setIsEditing(false);
  };

  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;
  const isAllowedToEdit = userRoles.some((role) => editRoles.has(role));

  return (
    <ViewComponent
      title="Room Information"
      iconName="info"
      onClose={() => setExclusiveState(null)}
      style={{ width: '400px', zIndex: window.innerWidth <= 780 ? 1 : null }}
      {...(viewType === 'Popup' ? { isPopupHeader: true } : {})}
    >
      <Box css={styles.container}>
        {!isEditing ? (
          <>
            <Avatar size="100%" url={getChannelAvatarURL(channelInfo.name)} />

            <Box
              css={css`
                margin: 16px;
                display: flex;
                flex-direction: column;
                gap: 5px;
              `}
            >
              <Box
                css={css`
                  margin-block: 16px;
                  font-size: 1.25rem;
                `}
              >
                # {channelInfo.name}
              </Box>
              {channelInfo.description && (
                <>
                  <Box
                    css={css`
                      margin-block: 5px;
                      font-weight: 900;
                    `}
                  >
                    Description
                  </Box>
                  <Box
                    css={css`
                      opacity: 0.5rem;
                    `}
                  >
                    {channelInfo.description}
                  </Box>
                </>
              )}
              {channelInfo.announcement && (
                <>
                  <Box
                    css={css`
                      margin-block: 5px;
                      font-weight: 900;
                    `}
                  >
                    Announcement
                  </Box>
                  <Box
                    css={css`
                      opacity: 0.5rem;
                    `}
                  >
                    {channelInfo.announcement}
                  </Box>
                </>
              )}
              {channelInfo.topic && (
                <>
                  <Box
                    css={css`
                      margin-block: 5px;
                      font-weight: 900;
                    `}
                  >
                    Topic
                  </Box>
                  <Box
                    css={css`
                      opacity: 0.5rem;
                    `}
                  >
                    {channelInfo.topic}
                  </Box>
                </>
              )}
            </Box>
            {isAllowedToEdit && (
              <Button
                onClick={() => setIsEditing(true)}
                css={css`
                  margin-top: 10px;
                `}
              >
                Edit Room Info
              </Button>
            )}
          </>
        ) : (
          <RoomInfoEdit channelInfo={channelInfo} onSave={handleSave} />
        )}
      </Box>
    </ViewComponent>
  );
};

export default RoomInformation;
