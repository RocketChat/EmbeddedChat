import { css } from '@emotion/react';

export const getRoomMemberStyles = () => {
  const styles = {
    inviteButtonStyles: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem 1rem 1rem 1rem',
      width: '100%',
    },
    memberListStyles: css`
      padding: 0 1rem 1rem;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    `,
    containerStyles: {
      position: 'absolute',
      left: '0',
      bottom: '0',
      top: '60px',
      width: '100%',
      height: 'auto',
      zIndex: 1,
    },
  };

  return styles;
};

export const RoomMemberItemStyles = {
  container: css`
    width: 100%;
    padding-bottom: 8px;
    padding-top: 8px;
    display: flex;
    align-items: center;
  `,

  icon: css`
    padding: 0.125em;
    margin-right: 0.5rem;
    align-self: center;
  `,
};

export const InviteMemberStyles = {
  parentContainer: css`
    width: 100%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
  `,

  childContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  `,
};
