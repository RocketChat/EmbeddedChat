import React from "react";
import {
  Heading,
  Tooltip,
  Box,
  Icon,
  ActionButton,
  Menu,
} from "@embeddedchat/ui-elements";
import useChatHeaderStyles from "./ChatHeader.styles";

const ChatHeader = ({
  optionConfig = {
    chatOptions: [
      "minmax",
      "thread",
      "mentions",
      "starred",
      "pinned",
      "files",
      "close",
      "members",
      "search",
      "rInfo",
      "logout",
    ],

    threshold: 7,
  },
}) => {
  const { chatOptions, threshold } = optionConfig;

  const styles = useChatHeaderStyles();
  const menuMap = {
    minmax: (
      <Tooltip text="Maximize" position="bottom" key="minmax">
        <ActionButton
          onClick={() => {}}
          ghost
          display="inline"
          square
          size="medium"
        >
          <Icon name="expand" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    close: (
      <Tooltip text="Close" position="bottom" key="close">
        <ActionButton
          key="close"
          onClick={() => {}}
          ghost
          display="inline"
          square
          size="medium"
        >
          <Icon name="cross" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),
    thread: (
      <Tooltip text="Threads" position="bottom" key="thread">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="thread" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    mentions: (
      <Tooltip text="Mentions" position="bottom" key="mention">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="at" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    starred: (
      <Tooltip text="Starred Messages" position="bottom" key="starred">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="star" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    pinned: (
      <Tooltip text="Pinned Messages" position="bottom" key="pinned">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="pin" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    members: (
      <Tooltip text="Members" position="bottom" key="members">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="members" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    files: (
      <Tooltip text="Files" position="bottom" key="files">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="clip" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    search: (
      <Tooltip text="Search Messages" position="bottom" key="search">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="magnifier" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    rInfo: (
      <Tooltip text="Room Information" position="bottom" key="rInfo">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="info" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    logout: (
      <Tooltip text="Logout" position="bottom" key="logout">
        <ActionButton square ghost onClick={() => {}}>
          <Icon name="reply-directly" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),
  };

  const menuOptions = chatOptions
    .slice(threshold)
    .map((key) => {
      const tool = menuMap[key];

      if (!tool) {
        return null;
      }

      const { onClick } = tool.props.children.props;
      const { name: icon } = tool.props.children.props.children.props;
      const { text } = tool.props;

      if (onClick && icon && text) {
        return {
          id: key,
          action: onClick,
          label: text,
          icon,
        };
      }

      return null;
    })
    .filter((option) => option !== null);

  return (
    <Box css={styles.chatHeaderParent}>
      <Box css={styles.chatHeaderChild}>
        <Box css={styles.channelDescription}>
          <Icon name="hash" size="1.25rem" />
          <Box>
            <Heading
              level={3}
              className="ec-chat-header--channelName"
              css={styles.clearSpacing}
            >
              general
            </Heading>

            <p
              className="ec-chat-header--channelDescription"
              css={styles.clearSpacing}
            >
              Channel description
            </p>
          </Box>
        </Box>
        <Box css={styles.chatHeaderIconRow}>
          {chatOptions.slice(0, threshold).map((key) => menuMap[key])}
          {menuOptions.length > 0 && <Menu options={menuOptions} />}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatHeader;
