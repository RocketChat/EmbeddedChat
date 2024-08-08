import React from 'react';
import { Box, Icon, useTheme } from '@embeddedchat/ui-elements';

import { getMenuItemStyles } from './Menu.styles';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const MenuItem = ({ id, icon, label, action, disabled, onRemove }) => {
  const theme = useTheme();
  const styles = getMenuItemStyles(theme);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'MenuOptions',
      icon,
      label,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  if (isDragging) {
    return <Box ref={setNodeRef} style={style} css={styles.dragOverlay} />;
  }

  const handleRemoveItem = (id) => {
    if (id !== 'placeholder-menu') onRemove(id);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      css={[styles.item, styles.showIcon, disabled && styles.disabled]}
      onClick={!disabled && action}
    >
      <Box css={styles.mainItems}>
        <Icon name={icon} size="1em" />
        {label}
      </Box>
      {id !== 'placeholder-menu' && (
        <Icon
          name="cross"
          css={styles.icon}
          className="crossIcon"
          height="12px"
          width="12px"
          onClick={() => {
            handleRemoveItem(id);
          }}
        />
      )}
    </Box>
  );
};

export default MenuItem;
