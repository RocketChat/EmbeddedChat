import React, { useMemo } from "react";
import { Box, Menu } from "@embeddedchat/ui-elements";
import { useMessageToolboxStyles } from "./Message.styles";
import SurfaceMenu from "../../components/SurfaceMenu/SurfaceMenu";

export const MessageToolbox = ({
  variantStyles = {},
  optionConfig = {
    surfaceItems: [
      "reaction",
      "reply",
      "quote",
      "star",
      "pin",
      "edit",
      "delete",
      "report",
    ],

    menuItems: [],
  },

  ...props
}) => {
  const styles = useMessageToolboxStyles();
  const surfaceItems = optionConfig.surfaceItems;
  const menuItems = optionConfig.menuItems;

  const options = useMemo(
    () => ({
      reply: {
        label: "Reply in thread",
        id: "reply",
        onClick: () => {},
        iconName: "thread",
        visible: true,
      },
      quote: {
        label: "Quote",
        id: "quote",
        onClick: () => {},
        iconName: "quote",
        visible: true,
      },
      star: {
        label: "Star",
        id: "star",
        onClick: () => {},
        iconName: "star",
        visible: true,
      },
      reaction: {
        label: "Add reaction",
        id: "reaction",
        onClick: () => {},
        iconName: "emoji",
        visible: true,
      },
      pin: {
        label: "Pin",
        id: "pin",
        onClick: () => {},
        iconName: "pin",
        visible: true,
      },
      edit: {
        label: "Edit",
        id: "edit",
        onClick: () => {},
        iconName: "edit",
        visible: true,
      },
      delete: {
        label: "Delete",
        id: "delete",
        onClick: () => {},
        iconName: "trash",
        visible: true,
        type: "destructive",
      },
      report: {
        label: "Report",
        id: "report",
        onClick: () => {},
        iconName: "report",
        visible: true,
        type: "destructive",
      },
    }),
    []
  );

  const menuOptions = menuItems
    ?.map((item) => {
      if (item in options && options[item].visible) {
        return {
          id: options[item].id,
          action: options[item].onClick,
          label: options[item].label,
          icon: options[item].iconName,
        };
      }
      return null;
    })
    .filter((option) => option !== null);

  const surfaceOptions = surfaceItems
    ?.map((item) => {
      if (item in options && options[item].visible) {
        return {
          id: options[item].id,
          onClick: options[item].onClick,
          label: options[item].label,
          iconName: options[item].iconName,
          type: options[item].type,
        };
      }
      return null;
    })
    .filter((option) => option !== null);

  return (
    <>
      <Box css={variantStyles.toolboxContainer || styles.toolboxContainer}>
        <Box css={styles.toolbox} className="ec-message-toolbox" {...props}>
          {surfaceOptions?.length > 0 && (
            <SurfaceMenu options={surfaceOptions} size="small" />
          )}
          {menuOptions?.length > 0 && (
            <Menu
              size="small"
              options={menuOptions}
              tooltip={{ isToolTip: true, position: "top", text: "More" }}
              useWrapper={false}
              style={{ top: "auto", bottom: `calc(100% + 2px)` }}
            />
          )}
        </Box>
      </Box>
    </>
  );
};
