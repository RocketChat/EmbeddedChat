import React from "react";
import {
  Tooltip,
  ActionButton,
  Box,
  useTheme,
} from "@embeddedchat/ui-elements";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getSurfaceItemStyles } from "./SurfaceMenu.styles";

const SurfaceItem = ({
  id,
  label,
  iconName,
  onClick,
  type,
  position = "bottom",
  size,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id,
      data: {
        type: "SurfaceOptions",
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

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Tooltip text={label} position={position} key={id}>
        <ActionButton
          square
          ghost
          onClick={onClick}
          icon={iconName}
          size={size}
          iconSize="small"
          color={type}
        />
      </Tooltip>
    </Box>
  );
};

export default SurfaceItem;
