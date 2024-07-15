import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@embeddedchat/ui-elements";
import { useChatInputToolbarStyles } from "./ChatInput.styles";
import SurfaceMenu from "../../components/SurfaceMenu/SurfaceMenu";
import SurfaceItem from "../../components/SurfaceMenu/SurfaceItem";
import Formatters from "./Formatters";
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

const ChatInputToolbar = ({
  optionConfig = {
    surfaceItems: ["emoji", "formatter", "audio", "video", "file"],
    formatters: ["bold", "italic", "strike", "code", "multiline"],
  },
}) => {
  const styles = useChatInputToolbarStyles();
  const [surfaceItems, setSurfaceItems] = useState(optionConfig.surfaceItems);
  const [formatters, setFormatters] = useState(optionConfig.formatters);
  const [activeSurfaceItem, setActiveSurfaceItem] = useState(null);
  const [formattersVisible, setFormattersVisible] = useState(false);

  const placeholderSurfaceItem = "placeholder-surface";

  const options = useMemo(() => {
    return {
      emoji: {
        label: "Emoji",
        id: "emoji",
        onClick: () => {},
        iconName: "emoji",
        visible: true,
      },
      audio: {
        label: "Audio Message",
        id: "audio",
        onClick: () => {},
        iconName: "mic",
        visible: true,
      },
      video: {
        label: "Video Message",
        id: "video",
        onClick: () => {},
        iconName: "video-recorder",
        visible: true,
      },
      file: {
        label: "Upload File",
        id: "file",
        onClick: () => {},
        iconName: "attachment",
        visible: true,
      },
      formatter: {
        label: "Formatter",
        id: "formatter",
        onClick: () => {
          setFormattersVisible((prev) => !prev);
        },
        iconName: "format-text",
        visible: true,
      },
    };
  }, []);

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
      if (options[event.active.id] !== undefined) {
        setFormattersVisible(false);
      }
      setActiveSurfaceItem({
        id: event.active.id,
        iconName: event.active.data.current.icon,
        label: event.active.data.current.label,
      });
    }
  };

  const handleDragEnd = (event) => {
    setActiveSurfaceItem(null);
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

        setFormatters((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  const surfaceOptions = useMemo(() => {
    return surfaceItems.length > 0
      ? surfaceItems
          .map((item) => {
            if (item === "formatter") {
              return options.formatter;
            }
            if (options[item] && options[item].visible) {
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
  }, [surfaceItems, options]);

  const removeSurfaceItem = (idToRemove) => {
    setSurfaceItems((items) => items.filter((item) => item !== idToRemove));
  };

  const removeFormatters = (idToRemove) => {
    setFormatters((items) => items.filter((item) => item !== idToRemove));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <Box css={styles.chatFormat} className="ec-chat-input-formatting-toolbar">
        {surfaceOptions.length > 0 && (
          <SurfaceMenu
            options={surfaceOptions}
            tooltipPosition="top"
            onRemove={removeSurfaceItem}
          />
        )}
      </Box>

      {createPortal(
        <DragOverlay zIndex={1700}>
          {activeSurfaceItem && <SurfaceItem {...activeSurfaceItem} />}
        </DragOverlay>,
        document.body
      )}

      {formattersVisible &&
        createPortal(
          <Formatters formatters={formatters} onRemove={removeFormatters} />,
          document.getElementById("formatter")
        )}
    </DndContext>
  );
};

export default ChatInputToolbar;
