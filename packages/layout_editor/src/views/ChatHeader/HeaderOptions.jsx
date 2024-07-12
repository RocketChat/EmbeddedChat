import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Box } from "@embeddedchat/ui-elements";
import { CSS } from "@dnd-kit/utilities";

const HeaderOptions = ({ id, menuMap }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {menuMap[id]}
    </Box>
  );
};

export default HeaderOptions;
