import React, { useEffect, useContext, useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Icon,
  Input,
  ActionButton,
  Heading,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import useInviteStore from '../../store/inviteStore';
import { InviteMemberStyles as styles } from './RoomMembers.styles';
import RCContext from '../../context/RCInstance';
import LoadingIndicator from '../MessageAggregators/common/LoadingIndicator';

const InviteMembers = () => {
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const dispatchToastMessage = useToastBarDispatch();
  const [inviteData, setInviteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { RCInstance } = useContext(RCContext);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await RCInstance.findOrCreateInvite();
        setInviteData(res);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, [RCInstance]);

  const copyToClipboard = () => {
    if (inviteData && inviteData.url) {
      navigator.clipboard
        .writeText(inviteData.url)
        .then(() => {
          dispatchToastMessage({
            type: 'success',
            message: 'Copied to clipboard',
          });
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Box
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <Box
            css={css`
              width: 100%;
              display: flex;
              justify-content: space-between;
            `}
          >
            <Heading level={3} style={{ display: 'contents' }}>
              Invite Members
            </Heading>

            <ActionButton onClick={() => toggleInviteView()} ghost size="small">
              <Icon name="back" size="1.25rem" />
            </ActionButton>
          </Box>

          <Box css={styles.parentContainer}>
            <Box css={styles.childContainer}>
              <Box is="span">
                <b>Invite Link</b>
              </Box>
              <ActionButton onClick={copyToClipboard} ghost size="small">
                <Icon name="copy" size="1.25rem" />
              </ActionButton>
            </Box>
            <Input readOnly value={inviteData.url} />
          </Box>

          <Box
            css={css`
              margin-top: 8px;
            `}
          >
            <p
              css={css`
                font-size: 0.78em;
              `}
            >
              <b>
                Your invite link will expire on{' '}
                {new Date(inviteData.expires).toString().split('GMT')[0]}
              </b>
            </p>
          </Box>
        </Box>
      )}
    </>
  );
};

export default InviteMembers;
