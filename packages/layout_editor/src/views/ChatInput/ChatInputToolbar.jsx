import React, { useMemo, useState } from 'react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { getChatInputToolbarStyles } from './ChatInput.styles';
import SurfaceMenu from '../../components/SurfaceMenu/SurfaceMenu';
import SurfaceItem from '../../components/SurfaceMenu/SurfaceItem';
import Formatters from './Formatters';
import useChatInputItemsStore from '../../store/chatInputItemsStore';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

const ChatInputToolbar = () => {
  const styles = getChatInputToolbarStyles(useTheme());
  const { surfaceItems, setSurfaceItems, formatters, setFormatters } =
    useChatInputItemsStore((state) => ({
      surfaceItems: state.surfaceItems,
      setSurfaceItems: state.setSurfaceItems,
      formatters: state.formatters,
      setFormatters: state.setFormatters,
    }));

  const [activeSurfaceItem, setActiveSurfaceItem] = useState(null);
  const [formattersVisible, setFormattersVisible] = useState(false);

  const placeholderSurfaceItem = 'placeholder-surface';

  const options = useMemo(() => {
    return {
      emoji: {
        label: 'Emoji',
        id: 'emoji',
        onClick: () => {},
        iconName: 'emoji',
        visible: true,
      },
      audio: {
        label: 'Audio Message',
        id: 'audio',
        onClick: () => {},
        iconName: 'mic',
        visible: true,
      },
      video: {
        label: 'Video Message',
        id: 'video',
        onClick: () => {},
        iconName: 'video-recorder',
        visible: true,
      },
      file: {
        label: 'Upload File',
        id: 'file',
        onClick: () => {},
        iconName: 'attachment',
        visible: true,
      },
      formatter: {
        label: 'Formatter',
        id: 'formatter',
        onClick: () => {
          setFormattersVisible((prev) => !prev);
        },
        iconName: 'format-text',
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
    if (event.active.data.current?.type === 'SurfaceOptions') {
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
        event.active.data.current?.type === 'SurfaceOptions' &&
        event.over.data.current?.type === 'SurfaceOptions'
      ) {
        const oldSurfaceIndex = surfaceItems.indexOf(active.id);
        const newSurfaceIndex = surfaceItems.indexOf(over.id);
        setSurfaceItems(
          arrayMove(surfaceItems, oldSurfaceIndex, newSurfaceIndex)
        );

        const oldFormatterIndex = formatters.indexOf(active.id);
        const newFormatterIndex = formatters.indexOf(over.id);
        setFormatters(
          arrayMove(formatters, oldFormatterIndex, newFormatterIndex)
        );
      }
    }
  };

  const surfaceOptions = useMemo(() => {
    return surfaceItems.length > 0
      ? surfaceItems
          .map((item) => {
            if (item === 'formatter') {
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
      : [{ id: placeholderSurfaceItem, label: 'No items', iconName: 'plus' }];
  }, [surfaceItems, options]);

  const removeSurfaceItem = (idToRemove) => {
    const newSurfaceItems = surfaceItems.filter((item) => item !== idToRemove);
    setSurfaceItems(newSurfaceItems);
  };

  const removeFormatters = (idToRemove) => {
    const newFormatters = formatters.filter((item) => item !== idToRemove);
    setFormatters(newFormatters);
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
          document.getElementById('formatter')
        )}
    </DndContext>
  );
};

export default ChatInputToolbar;
