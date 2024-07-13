import React, { useState } from "react";
import {
  Heading,
  Box,
  Icon,
  ActionButton,
  Tooltip,
  useTheme,
} from "@embeddedchat/ui-elements";
import { getChatHeaderStyles } from "./ChatHeader.styles";
import HeaderOptions from "./HeaderOptions";
import { Menu } from "../../components/SortableMenu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import MenuItem from "../../components/SortableMenu/MenuItem";

const ChatHeader = ({
  optionConfig = {
    toolOptions: [
      "minmax",
      "thread",
      "mentions",
      "starred",
      "pinned",
      "files",
      "members",
      "search",
      "rInfo",
      "logout",
      "close",
    ],

    threshold: 4,
  },
}) => {
  const theme = useTheme();
  const styles = getChatHeaderStyles(theme);
  const [toolOptions, setToolOptions] = useState(optionConfig.toolOptions);
  const [activeRowOption, setActiveRowOption] = useState(null);
  const [activeColumnOption, setActiveColumnOption] = useState(null);
  const [threshold] = useState(optionConfig.threshold);

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

  const menuOptions = toolOptions
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragStart = (event) => {
    if (event.active.data.current?.type === "RowOptions") {
      setActiveRowOption(event.active.id);
    } else if (event.active.data.current?.type === "ColumnOptions") {
      setActiveColumnOption({
        id: event.active.id,
        icon: event.active.data.current.icon,
        label: event.active.data.current.label,
      });
    }
  };
  const handleDragEnd = (event) => {
    setActiveRowOption(null);
    setActiveColumnOption(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      setToolOptions((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Box css={styles.chatHeaderIconRow}>
            <SortableContext items={toolOptions}>
              {toolOptions.slice(0, threshold).map((key) => (
                <HeaderOptions key={key} id={key} menuMap={menuMap} />
              ))}
            </SortableContext>
            {menuOptions.length > 0 && <Menu options={menuOptions} />}
          </Box>
          {createPortal(
            <DragOverlay zIndex={1700}>
              {activeRowOption && (
                <HeaderOptions id={activeRowOption} menuMap={menuMap} />
              )}
              {activeColumnOption && <MenuItem {...activeColumnOption} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </Box>
    </Box>
  );
};

export default ChatHeader;
