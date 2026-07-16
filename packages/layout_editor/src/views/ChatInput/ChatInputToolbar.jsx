import React, { useMemo, useState } from 'react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { getChatInputToolbarStyles } from './ChatInput.styles';
import SurfaceMenu from '../../components/SurfaceMenu/SurfaceMenu';
import SurfaceItem from '../../components/SurfaceMenu/SurfaceItem';
import Formatters from './Formatters';
import useChatInputItemsStore from '../../store/chatInputItemsStore';
import useAiGeneratedBlocksStore from '../../store/aiGeneratedBlocksStore';
import PreviewErrorBoundary from '../../components/PreviewErrorBoundary';
import { UiKitMessage, UiKitModal, UiKitContextualBar } from '@embeddedchat/ui-kit';
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

const componentTypeIconMap = {
  form: 'edit',
  profile: 'user',
  gallery: 'file',
  cta: 'star',
  info: 'info',
};

const ChatInputToolbar = ({ messageRef, inputRef }) => {
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
  const [aiOpen, setAiOpen] = useState(false);
  
  const { publishedBlocks, publishedSurface, publishedComponentType } = useAiGeneratedBlocksStore(
    (state) => ({
      publishedBlocks: state.publishedBlocks,
      publishedSurface: state.publishedSurface,
      publishedComponentType: state.publishedComponentType,
    })
  );

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
      link: {
        label: 'Link',
        id: 'link',
        onClick: () => {},
        iconName: 'link',
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
      ai: {
        label: 'AI-Generated Content',
        id: 'ai',
        onClick: () => {
          setAiOpen((prev) => !prev);
        },
        iconName: componentTypeIconMap[publishedComponentType] || 'info',
        visible: true,
      },
    };
  }, [setAiOpen, publishedComponentType]);

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
        {aiOpen && (
          <Box
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              zIndex: 1000,
              background: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              padding: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minWidth: '250px',
              color: '#374151',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.375rem' }}>
              <span>AI Generated Component</span>
              <button onClick={() => setAiOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#9ca3af' }}>✕</button>
            </div>
            <PreviewErrorBoundary>
              {publishedBlocks && publishedBlocks.length > 0 ? (
                publishedSurface === 'contextualBar'
                  ? UiKitContextualBar(publishedBlocks)
                  : publishedSurface === 'modal'
                  ? UiKitModal(publishedBlocks)
                  : UiKitMessage(publishedBlocks)
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
                  No AI content published yet.
                </div>
              )}
            </PreviewErrorBoundary>
          </Box>
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
