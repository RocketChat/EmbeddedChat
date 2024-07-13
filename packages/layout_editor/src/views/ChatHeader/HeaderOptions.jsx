import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Box, useTheme } from "@embeddedchat/ui-elements";
import { CSS } from "@dnd-kit/utilities";
import { getChatHeaderStyles } from "./ChatHeader.styles";

const HeaderOptions = ({ id, menuMap }) => {
  const theme = useTheme();
  const styles = getChatHeaderStyles(theme);
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
      type: "RowOptions",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return <Box ref={setNodeRef} style={style} css={styles.overlayBox}></Box>;
  }

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {menuMap[id]}
    </Box>
  );
};

export default HeaderOptions;
