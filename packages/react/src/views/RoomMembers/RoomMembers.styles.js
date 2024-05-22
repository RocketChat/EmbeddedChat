import { css, useTheme } from '@emotion/react';
import { alpha } from '../../lib/color';
import { useThemeStore } from '../../store';

export const useRoomMemberStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const container = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 1rem 1rem;
    ::-webkit-scrollbar {
      width: 4px;
      height: 7.7px;
    }
    ::-webkit-scrollbar-thumb {
      background: ${alpha(colors.primary, 0.5)};
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${colors.primary};
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
  `;

  return { container };
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
