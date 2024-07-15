import React from "react";
import PropTypes from "prop-types";
import { Box, Avatar, Icon, Sidebar, Popup } from "@embeddedchat/ui-elements";
import { css } from "@emotion/react";
import { useDemoSidebarStyles } from "./DemoSidebar.styles";

const DemoSidebar = ({ members, viewType = "Sidebar" }) => {
  const ViewComponent = viewType === "Popup" ? Popup : Sidebar;
  const styles = useDemoSidebarStyles();
  return (
    <ViewComponent
      title="Members"
      iconName="members"
      {...(viewType === "Popup" ? { isPopupHeader: true } : {})}
    >
      {members.map((member, index) => (
        <Box key={index} css={styles.itemContainer}>
          <Avatar
            url={member.avatarUrl}
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
            {member.userStatus && (
              <Icon name={member.userStatus} size="1.25rem" css={styles.icon} />
            )}
            <Box is="span">{member.username}</Box>
          </Box>
        </Box>
      ))}
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
  viewType: PropTypes.oneOf(["Sidebar", "Popup"]),
};

export default DemoSidebar;
