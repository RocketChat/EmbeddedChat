import React from 'react';
import {
  Tooltip,
  ActionButton,
  Box,
  useTheme,
  Icon,
} from '@embeddedchat/ui-elements';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getSurfaceItemStyles } from './SurfaceMenu.styles';

const SurfaceItem = ({
  id,
  label,
  iconName,
  onClick,
  onRemove,
  type,
  cursor = 'grab',
  tooltipPosition = 'bottom',
  size,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id,
      data: {
        type: 'SurfaceOptions',
        icon: iconName,
        label,
      },
    });
  const theme = useTheme();
  const styles = getSurfaceItemStyles(theme);

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <Box ref={setNodeRef} style={style} css={styles.overlayBox}></Box>;
  }

  const handleRemoveItem = (id) => {
    if (id !== 'placeholder-surface') onRemove(id);
  };

  return (
    <Box ref={setNodeRef} style={style} id={id} {...attributes} {...listeners}>
      <Box css={styles.itemContainer}>
        <Tooltip text={label} position={tooltipPosition} key={id}>
          <ActionButton
            square
            ghost
            onClick={onClick}
            icon={iconName}
            size={size}
            iconSize="small"
            color={type}
            style={{
              cursor: cursor,
            }}
          />

          {id !== 'placeholder-surface' && onRemove && (
            <Box
              css={styles.iconBox}
              onClick={() => {
                handleRemoveItem(id);
              }}
            >
              <Icon
                name="cross"
                className="crossIcon"
                height="12px"
                width="12px"
                css={styles.icon}
              />
            </Box>
          )}
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SurfaceItem;
