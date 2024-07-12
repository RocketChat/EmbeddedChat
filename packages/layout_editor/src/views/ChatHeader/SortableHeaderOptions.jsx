import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Box, Tooltip, ActionButton, Icon } from "@embeddedchat/ui-elements";
import { CSS } from "@dnd-kit/utilities";

const SortableHeaderOptions = (props) => {
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {menuMap[props.id]}
    </Box>
  );
};

export default SortableHeaderOptions;
