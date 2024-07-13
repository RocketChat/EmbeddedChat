import React from "react";
import { css } from "@emotion/react";
import {
  Box,
  ActionButton,
  Tooltip,
  useTheme,
} from "@embeddedchat/ui-elements";
import MenuItem from "./MenuItem";
import { getMenuStyles } from "./Menu.styles";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const Menu = ({
  options = [],
  tooltip = { isToolTip: true, position: "bottom", text: "Options" },
  size = "medium",
}) => {
  const theme = useTheme();
  const styles = getMenuStyles(theme);

  return (
    <Box>
      <Tooltip text={tooltip.text} position={tooltip.position}>
        <ActionButton ghost icon="kebab" size={size} />
      </Tooltip>

      <Box
        css={[
          styles.container,
          css`
            box-shadow: ${theme.theme.shadows[2]};
          `,
        ]}
      >
        <SortableContext items={options} strategy={verticalListSortingStrategy}>
          {options.map((option, idx) => (
            <MenuItem {...option} key={option.id || idx} />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
};

export default Menu;
