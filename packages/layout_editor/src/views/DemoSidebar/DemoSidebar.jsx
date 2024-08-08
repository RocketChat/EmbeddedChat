import React from 'react';
import PropTypes from 'prop-types';
import { Box, Icon, Sidebar, Popup, Button } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';
import { getDemoSidebarStyles } from './DemoSidebar.styles';
import useLayoutStore from '../../store/layoutStore';

const DemoSidebar = ({ members, viewType = 'Sidebar' }) => {
  const themeLabOpen = useLayoutStore((state) => state.themeLabOpen);
  const setThemeLabOpen = useLayoutStore((state) => state.setThemeLabOpen);
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;
  const styles = getDemoSidebarStyles();
  return (
    <ViewComponent
      title="Demo Panel"
      iconName="members"
      {...(viewType === 'Popup' ? { isPopupHeader: true } : {})}
    >
      <Box css={styles.container}>
        <Box>
          {members.map((member, index) => (
            <Box key={index} css={styles.itemContainer}>
              <Icon
                name="avatar"
                alt="avatar"
                size="1.5rem"
                css={css`
                  margin-right: 0.5rem;
                `}
              />
              <Box
                is="span"
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                {member.status && (
                  <Icon name={member.status} size="1.25rem" css={styles.icon} />
                )}
                <Box is="span">{member.username}</Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box>
          <Button
            type="secondary"
            css={[styles.btn, themeLabOpen && styles.btnInvisible]}
            onClick={() => {
              setThemeLabOpen(true);
            }}
          >
            🔮 Start Theming !
          </Button>
        </Box>
      </Box>
    </ViewComponent>
  );
};

DemoSidebar.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      avatarUrl: PropTypes.string,
      userStatus: PropTypes.string,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  viewType: PropTypes.oneOf(['Sidebar', 'Popup']),
};

export default DemoSidebar;
