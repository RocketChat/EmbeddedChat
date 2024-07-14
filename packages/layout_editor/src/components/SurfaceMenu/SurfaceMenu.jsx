import React from "react";
import SurfaceItem from "./SurfaceItem";
import { SortableContext } from "@dnd-kit/sortable";

const SurfaceMenu = ({ options, tooltipPosition }) => {
  return (
    <SortableContext items={options}>
      {options?.map((item, idx) => (
        <SurfaceItem {...item} key={idx} position={tooltipPosition} />
      ))}
    </SortableContext>
  );
};

export default SurfaceMenu;
