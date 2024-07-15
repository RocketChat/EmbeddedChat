import React, { useState, useMemo } from "react";
import { Heading, Box, Icon, useTheme } from "@embeddedchat/ui-elements";
import { getChatHeaderStyles } from "./ChatHeader.styles";
import { Menu } from "../../components/SortableMenu";
import SurfaceItem from "../../components/SurfaceMenu/SurfaceItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import MenuItem from "../../components/SortableMenu/MenuItem";
import SurfaceMenu from "../../components/SurfaceMenu/SurfaceMenu";

const ChatHeader = ({
  optionConfig = {
    surfaceItems: [
      "minmax",
      "close",
      "thread",
      "mentions",
      "starred",
      "pinned",
    ],
    menuItems: ["files", "members", "search", "rInfo", "logout"],
  },
}) => {
  const theme = useTheme();
  const styles = getChatHeaderStyles(theme);
  const [surfaceItems, setSurfaceItems] = useState(optionConfig.surfaceItems);
  const [menuItems, setMenuItems] = useState(optionConfig.menuItems);
  const [activeSurfaceItem, setActiveSurfaceItem] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  const placeholderSurfaceItem = "placeholder-surface";
  const placeholderMenuItem = "placeholder-menu";

  const options = useMemo(
    () => ({
      minmax: {
        label: "Maximize",
        id: "minmax",
        onClick: () => {},
        iconName: "expand",
        visible: true,
      },
      close: {
        label: "Close",
        id: "close",
        onClick: () => {},
        iconName: "cross",
        visible: true,
      },
      thread: {
        label: "Threads",
        id: "thread",
        onClick: () => {},
        iconName: "thread",
        visible: true,
      },
      mentions: {
        label: "Mentions",
        id: "mentions",
        onClick: () => {},
        iconName: "at",
        visible: true,
      },
      starred: {
        label: "Starred Messages",
        id: "starred",
        onClick: () => {},
        iconName: "star",
        visible: true,
      },
      pinned: {
        label: "Pinned Messages",
        id: "pinned",
        onClick: () => {},
        iconName: "pin",
        visible: true,
      },
      members: {
        label: "Members",
        id: "members",
        onClick: () => {},
        iconName: "members",
        visible: true,
      },
      files: {
        label: "Files",
        id: "files",
        onClick: () => {},
        iconName: "clip",
        visible: true,
      },
      search: {
        label: "Search Messages",
        id: "search",
        onClick: () => {},
        iconName: "magnifier",
        visible: true,
      },
      rInfo: {
        label: "Room Information",
        id: "rInfo",
        onClick: () => {},
        iconName: "info",
        visible: true,
      },
      logout: {
        label: "Logout",
        id: "logout",
        onClick: () => {},
        iconName: "reply-directly",
        visible: true,
      },
    }),
    []
  );

  const menuOptions =
    menuItems.length > 0
      ? menuItems
          .map((item) => {
            if (item in options && options[item].visible) {
              return {
                id: options[item].id,
                action: options[item].onClick,
                label: options[item].label,
                icon: options[item].iconName,
              };
            }
            return null;
          })
          .filter((option) => option !== null)
      : [{ id: placeholderMenuItem, label: "No items", icon: "plus" }];

  const surfaceOptions =
    surfaceItems.length > 0
      ? surfaceItems
          .map((item) => {
            if (item in options && options[item].visible) {
              return {
                id: options[item].id,
                onClick: options[item].onClick,
                label: options[item].label,
                iconName: options[item].iconName,
              };
            }
            return null;
          })
          .filter((option) => option !== null)
      : [{ id: placeholderSurfaceItem, label: "No items", iconName: "plus" }];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1.5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    if (event.active.data.current?.type === "SurfaceOptions") {
      setActiveSurfaceItem({
        id: event.active.id,
        iconName: event.active.data.current.icon,
        label: event.active.data.current.label,
      });
    } else if (event.active.data.current?.type === "MenuOptions") {
      setActiveMenuItem({
        id: event.active.id,
        icon: event.active.data.current.icon,
        label: event.active.data.current.label,
      });
    }
  };

  const handleDragEnd = (event) => {
    setActiveSurfaceItem(null);
    setActiveMenuItem(null);
    const { active, over } = event || {};

    if (active?.id !== over?.id) {
      if (
        event.active.data.current?.type === "SurfaceOptions" &&
        event.over.data.current?.type === "SurfaceOptions"
      ) {
        setSurfaceItems((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (
        event.active.data.current?.type === "MenuOptions" &&
        event.over.data.current?.type === "MenuOptions"
      ) {
        setMenuItems((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (
        event.active.data.current?.type === "SurfaceOptions" &&
        event.over.data.current?.type === "MenuOptions" &&
        active.id !== placeholderSurfaceItem
      ) {
        setSurfaceItems((items) => items.filter((item) => item !== active.id));
        setMenuItems((items) => {
          const newItems = [
            ...items.filter((item) => item !== placeholderMenuItem),
            active.id,
          ];
          return newItems;
        });
      } else if (
        event.active.data.current?.type === "MenuOptions" &&
        event.over.data.current?.type === "SurfaceOptions" &&
        active.id !== placeholderMenuItem
      ) {
        setMenuItems((items) => items.filter((item) => item !== active.id));
        setSurfaceItems((items) => {
          const newItems = [
            ...items.filter((item) => item !== placeholderSurfaceItem),
            active.id,
          ];
          return newItems;
        });
      }
    }
  };

  const removeSurfaceItem = (idToRemove) => {
    setSurfaceItems((items) => items.filter((item) => item !== idToRemove));
  };

  const removeMenuItem = (idToRemove) => {
    setMenuItems((items) => items.filter((item) => item !== idToRemove));
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

            <Box
              is="span"
              className="ec-chat-header--channelDescription"
              css={styles.clearSpacing}
            >
              Channel description
            </Box>
          </Box>
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Box css={styles.chatHeaderIconRow}>
            {surfaceOptions.length > 0 && (
              <SurfaceMenu
                options={surfaceOptions}
                onRemove={removeSurfaceItem}
              />
            )}
            {menuOptions.length > 0 && (
              <Menu options={menuOptions} onRemove={removeMenuItem} />
            )}
          </Box>
          {createPortal(
            <DragOverlay zIndex={1700}>
              {activeSurfaceItem && <SurfaceItem {...activeSurfaceItem} />}
              {activeMenuItem && <MenuItem {...activeMenuItem} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </Box>
    </Box>
  );
};

export default ChatHeader;
