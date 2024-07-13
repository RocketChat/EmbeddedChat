import React from "react";
import { Box, Icon, useTheme } from "@embeddedchat/ui-elements";

import { getMenuItemStyles } from "./Menu.styles";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MenuItem = ({ id, icon, label, action, disabled }) => {
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
      type: "MenuOptions",
      icon,
      label,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return <Box ref={setNodeRef} style={style} css={styles.dragOverlay} />;
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      css={[styles.item, disabled && styles.disabled]}
      onClick={!disabled && action}
    >
      <Icon name={icon} size="1em" />
      {label}
    </Box>
  );
};

export default MenuItem;
