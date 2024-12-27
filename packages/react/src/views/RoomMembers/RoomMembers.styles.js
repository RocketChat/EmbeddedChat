import { css } from '@emotion/react';

export const getRoomMemberStyles = (theme) => {
  const styles = {
    container: css`
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      padding: 0 1rem 1rem;
      box-sizing: border-box;
    `,
    searchContainer: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid ${theme.colors.border};
      padding: 0 0.5rem;
      border-radius: ${theme.radius};
      position: relative;
      margin-top: 1rem;
    `,
    filterContainer: css`
      border-radius: ${theme.radius};
      margin-top: 1rem;
      margin-bottom: 2.5rem;
      position: relative;
      background-color: ${theme.colors.background};
      width: 100%;
    `,
    textInput: css`
      flex: 1;
      border: none;
      padding: none;
      font-size: 1rem;
      &:focus {
        outline: none;
      }
    `,
    searchIcon: css`
      padding-left: 0.5rem;
      font-size: 1.25rem;
      color: ${theme.colors.icon};
    `,
    memberList: css`
      flex: 1;
      overflow-y: auto;
      margin-top: 1rem;
    `,
    noMembers: css`
      text-align: center;
      color: ${theme.colors.textSecondary};
      margin-top: 1rem;
    `,
  };

  return styles;
};

export const RoomMemberItemStyles = (theme) => {
  const styles = {
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

    adminTag: css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.primaryForeground};
      padding: 0.2rem 0.5rem;
      border-radius: ${theme.radius};
      font-size: 0.5rem;
      font-weight: bold;
      margin-left: 0.3rem;
      display: inline-block;
    `,

    ownerTag: css`
      background-color: ${theme.invertedColors.primary};
      color: ${theme.invertedColors.primaryForeground};
      padding: 0.2rem 0.5rem;
      border-radius: ${theme.radius};
      font-size: 0.5rem;
      font-weight: bold;
      margin-left: 0.3rem;
      display: inline-block;
    `,

    moderatorTag: css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.secondaryForeground};
      padding: 0.2rem 0.5rem;
      border-radius: ${theme.radius};
      font-size: 0.5rem;
      font-weight: bold;
      margin-left: 0.3rem;
      display: inline-block;
    `,

    leaderTag: css`
      background-color: ${theme.invertedColors.secondary};
      color: ${theme.invertedColors.secondaryForeground};
      padding: 0.2rem 0.5rem;
      border-radius: ${theme.radius};
      font-size: 0.5rem;
      font-weight: bold;
      margin-left: 0.3rem;
      display: inline-block;
    `,
  };

  return styles;
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
